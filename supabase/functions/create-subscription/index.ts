
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

function validateInput(data: any): boolean {
  // Basic input validation
  if (!data || typeof data !== 'object') return false
  
  // Add more specific validation as needed
  return true
}

serve(async (req) => {
  // Security headers for all responses
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const thawaniPublishableKey = Deno.env.get('THAWANI_PUBLISHABLE_KEY')!
    const thawaniSecretKey = Deno.env.get('THAWANI_SECRET_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const requestData = await req.json()
    
    if (!validateInput(requestData)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get subscription configuration
    const { data: configData } = await supabase.rpc('get_subscription_config_json')
    const priceInBaiza = parseInt(configData?.subscription_price_baiza || '1400')

    // Create Thawani checkout session
    const thawaniResponse = await fetch('https://uatcheckout.thawani.om/api/v1/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': thawaniSecretKey,
      },
      body: JSON.stringify({
        client_reference_id: user.id,
        mode: 'payment',
        products: [{
          name: 'Premium Subscription',
          unit_amount: priceInBaiza,
          quantity: 1,
        }],
        success_url: `${req.headers.get('origin')}/subscription-success`,
        cancel_url: `${req.headers.get('origin')}/subscription-cancel`,
        metadata: {
          user_id: user.id,
        },
      }),
    })

    if (!thawaniResponse.ok) {
      const errorData = await thawaniResponse.text()
      console.error('Thawani API error:', errorData)
      throw new Error('Failed to create checkout session')
    }

    const sessionData = await thawaniResponse.json()

    // Store payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        thawani_payment_id: sessionData.data.session_id,
        amount: priceInBaiza / 100, // Convert to OMR
        status: 'pending',
      })

    if (paymentError) {
      console.error('Error storing payment:', paymentError)
      throw paymentError
    }

    return new Response(
      JSON.stringify({
        checkout_url: sessionData.data.checkout_url,
        session_id: sessionData.data.session_id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Subscription creation error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
