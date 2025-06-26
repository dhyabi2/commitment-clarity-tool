
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Enhanced logging function
const logStep = (step: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] WEBHOOK: ${step}`, data ? JSON.stringify(data, null, 2) : '');
}

serve(async (req) => {
  try {
    logStep('Webhook received', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    logStep('Webhook body parsed', { body });

    if (body.event_type === 'payment_intent.succeeded') {
      const { client_reference_id, payment_intent_id, amount, currency } = body.data

      logStep('Processing successful payment', {
        client_reference_id,
        payment_intent_id,
        amount,
        currency
      });

      // Get subscription configuration for duration
      const { data: configData, error: configError } = await supabase
        .rpc('get_subscription_config_json')

      if (configError) {
        logStep('ERROR: Failed to fetch subscription config', { error: configError });
        throw configError
      }

      const config = configData as Record<string, string>
      const durationDays = parseInt(config.subscription_duration_days || '30')

      logStep('Using subscription duration', { durationDays });

      // Calculate subscription period
      const currentPeriodStart = new Date()
      const currentPeriodEnd = new Date(currentPeriodStart.getTime() + durationDays * 24 * 60 * 60 * 1000)

      logStep('Calculated subscription period', {
        currentPeriodStart: currentPeriodStart.toISOString(),
        currentPeriodEnd: currentPeriodEnd.toISOString()
      });

      // Update subscription status
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          plan_type: 'premium',
          thawani_subscription_id: payment_intent_id,
          current_period_start: currentPeriodStart.toISOString(),
          current_period_end: currentPeriodEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', client_reference_id)

      if (updateError) {
        logStep('ERROR: Failed to update subscription', { error: updateError });
        throw updateError
      }

      logStep('Subscription updated successfully');

      // Record payment
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', client_reference_id)
        .single()

      if (subscription) {
        logStep('Recording payment', { userId: subscription.user_id });
        
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([{
            user_id: subscription.user_id,
            subscription_id: client_reference_id,
            thawani_payment_id: payment_intent_id,
            amount: amount / 100, // Convert from baiza to OMR
            currency: currency || 'OMR',
            status: 'completed'
          }])

        if (paymentError) {
          logStep('ERROR: Failed to record payment', { error: paymentError });
        } else {
          logStep('Payment recorded successfully');
        }
      }

      logStep('Subscription activation completed', { durationDays });
    } else {
      logStep('Unhandled webhook event type', { event_type: body.event_type });
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Webhook processing failed', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response('Error', { status: 400 })
  }
})
