
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Create or get subscription record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let subscriptionId: string

    if (subError && subError.code === 'PGRST116') {
      // Create new subscription record
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          status: 'free',
          plan_type: 'free'
        }])
        .select()
        .single()

      if (createError) throw createError
      subscriptionId = newSub.id
    } else if (subError) {
      throw subError
    } else {
      subscriptionId = subscription.id
    }

    // Create Thawani checkout session
    const thawaniResponse = await fetch('https://uatcheckout.thawani.om/api/v1/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': Deno.env.get('THAWANI_SECRET_KEY') ?? ''
      },
      body: JSON.stringify({
        client_reference_id: subscriptionId,
        mode: 'subscription',
        products: [{
          name: 'Premium Thoughts Subscription',
          unit_amount: 1400, // 14 OMR in baiza
          quantity: 1
        }],
        success_url: `${req.headers.get('origin')}/subscription/success`,
        cancel_url: `${req.headers.get('origin')}/subscription/cancel`,
        metadata: {
          user_id: user.id,
          subscription_id: subscriptionId
        }
      })
    })

    const thawaniData = await thawaniResponse.json()

    if (!thawaniResponse.ok) {
      console.error('Thawani API error:', thawaniData)
      throw new Error('Failed to create checkout session')
    }

    return new Response(
      JSON.stringify({ 
        checkout_url: `https://uatcheckout.thawani.om/pay/${thawaniData.data.session_id}?key=${Deno.env.get('THAWANI_PUBLISHABLE_KEY')}`,
        session_id: thawaniData.data.session_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
