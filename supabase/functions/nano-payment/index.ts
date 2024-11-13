import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NANO_NODE_URL = Deno.env.get('NANO_NODE_URL')
const WALLET_ADDRESS = Deno.env.get('NANO_WALLET_ADDRESS')
const COMMITMENT_FEE = "0.01" // 0.01 XNO fee per commitment

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { commitment_id } = await req.json()
    
    // Generate a unique payment request
    const paymentData = {
      action: "payment_request",
      amount: COMMITMENT_FEE,
      wallet: WALLET_ADDRESS,
      commitment_id: commitment_id
    }

    console.log('Creating Nano payment request:', paymentData)
    
    return new Response(
      JSON.stringify(paymentData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error processing Nano payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    )
  }
})