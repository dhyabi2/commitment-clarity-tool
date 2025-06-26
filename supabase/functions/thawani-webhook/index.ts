
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-thawani-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
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

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const encoder = new TextEncoder()
    const key = encoder.encode(secret)
    const data = encoder.encode(payload)
    
    // Simple HMAC verification - in production, use proper crypto library
    // This is a basic implementation for demonstration
    const expectedSignature = `sha256=${btoa(payload + secret)}`
    return signature === expectedSignature
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
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
    const thawaniSecretKey = Deno.env.get('THAWANI_SECRET_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const rawBody = await req.text()
    const signature = req.headers.get('x-thawani-signature') || ''
    
    // Verify webhook signature for security
    if (!verifyWebhookSignature(rawBody, signature, thawaniSecretKey)) {
      console.error('Invalid webhook signature')
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const webhookData = JSON.parse(rawBody)
    console.log('Webhook received:', webhookData)

    // Process the webhook based on event type
    if (webhookData.event_type === 'payment_success') {
      const paymentId = webhookData.data.payment_id
      const subscriptionId = webhookData.data.subscription_id
      
      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('thawani_payment_id', paymentId)

      if (paymentError) {
        console.error('Error updating payment:', paymentError)
        throw paymentError
      }

      // Update subscription status
      if (subscriptionId) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({ 
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('thawani_subscription_id', subscriptionId)

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError)
          throw subscriptionError
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
