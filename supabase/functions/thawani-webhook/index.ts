
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Webhook received:', body)

    if (body.event_type === 'payment_intent.succeeded') {
      const { client_reference_id, payment_intent_id, amount, currency } = body.data

      // Update subscription status
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          plan_type: 'premium',
          thawani_subscription_id: payment_intent_id,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          updated_at: new Date().toISOString()
        })
        .eq('id', client_reference_id)

      if (updateError) {
        console.error('Error updating subscription:', updateError)
        throw updateError
      }

      // Record payment
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', client_reference_id)
        .single()

      if (subscription) {
        await supabase
          .from('payments')
          .insert([{
            user_id: subscription.user_id,
            subscription_id: client_reference_id,
            thawani_payment_id: payment_intent_id,
            amount: amount / 100, // Convert from baiza to OMR
            currency: currency || 'OMR',
            status: 'completed'
          }])
      }

      console.log('Subscription activated successfully')
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 400 })
  }
})
