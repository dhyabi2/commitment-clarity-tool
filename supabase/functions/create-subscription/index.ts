
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced logging function
const logStep = (step: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${step}`, data ? JSON.stringify(data, null, 2) : '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('CREATE-SUBSCRIPTION: Function started');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Enhanced authentication logging
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      logStep('ERROR: No authorization header provided');
      throw new Error('No authorization header provided')
    }

    const token = authHeader.replace('Bearer ', '')
    logStep('Authenticating user with token');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError) {
      logStep('ERROR: User authentication failed', { error: userError });
      throw new Error(`User authentication failed: ${userError.message}`)
    }

    if (!user) {
      logStep('ERROR: User not authenticated');
      throw new Error('User not authenticated')
    }

    logStep('User authenticated successfully', { 
      userId: user.id, 
      email: user.email 
    });

    // Enhanced environment variable checking
    const thawaniSecretKey = Deno.env.get('THAWANI_SECRET_KEY');
    const thawaniPublishableKey = Deno.env.get('THAWANI_PUBLISHABLE_KEY');
    
    if (!thawaniSecretKey) {
      logStep('ERROR: THAWANI_SECRET_KEY not found in environment');
      throw new Error('THAWANI_SECRET_KEY is not configured')
    }

    if (!thawaniPublishableKey) {
      logStep('ERROR: THAWANI_PUBLISHABLE_KEY not found in environment');
      throw new Error('THAWANI_PUBLISHABLE_KEY is not configured')
    }

    logStep('Thawani keys found', {
      secretKeyLength: thawaniSecretKey.length,
      publishableKeyLength: thawaniPublishableKey.length,
      secretKeyPrefix: thawaniSecretKey.substring(0, 10) + '...',
      publishableKeyPrefix: thawaniPublishableKey.substring(0, 10) + '...'
    });

    // Get subscription configuration with detailed logging
    logStep('Fetching subscription configuration');
    const { data: configData, error: configError } = await supabase
      .rpc('get_subscription_config_json')

    if (configError) {
      logStep('ERROR: Failed to fetch subscription config', { error: configError });
      throw new Error('Failed to fetch subscription configuration')
    }

    const config = configData as Record<string, string>
    const priceInBaiza = parseInt(config.subscription_price_baiza || '1400')
    const priceInOMR = config.subscription_price_omr || '14'

    logStep('Subscription config loaded', { 
      priceInBaiza, 
      priceInOMR,
      fullConfig: config 
    });

    // Create or get subscription record with detailed logging
    logStep('Checking existing subscription');
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let subscriptionId: string

    if (subError && subError.code === 'PGRST116') {
      logStep('Creating new subscription record');
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          status: 'free',
          plan_type: 'free'
        }])
        .select()
        .single()

      if (createError) {
        logStep('ERROR: Failed to create subscription', { error: createError });
        throw createError
      }
      
      subscriptionId = newSub.id
      logStep('New subscription created', { subscriptionId });
    } else if (subError) {
      logStep('ERROR: Failed to fetch subscription', { error: subError });
      throw subError
    } else {
      subscriptionId = subscription.id
      logStep('Existing subscription found', { 
        subscriptionId, 
        currentStatus: subscription.status,
        currentPlan: subscription.plan_type 
      });
    }

    // Get the origin for redirect URLs
    const origin = req.headers.get('origin') || 'https://2aa4e7a5-d631-4c39-bd02-c3aa11cc6dc2.lovableproject.com';

    // Enhanced Thawani API call with LIVE environment
    const thawaniPayload = {
      client_reference_id: subscriptionId,
      mode: 'payment', // Using 'payment' mode for one-time subscription activation
      products: [{
        name: 'Premium Thoughts Subscription',
        unit_amount: priceInBaiza,
        quantity: 1
      }],
      success_url: `${origin}/subscription/success`,
      cancel_url: `${origin}/subscription/cancel`,
      metadata: {
        user_id: user.id,
        subscription_id: subscriptionId
      }
    };

    // LIVE Thawani API endpoint
    const thawaniApiUrl = 'https://checkout.thawani.om/api/v1/checkout/session';

    logStep('Preparing Thawani API request (LIVE)', {
      url: thawaniApiUrl,
      payload: thawaniPayload,
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': `${thawaniSecretKey.substring(0, 10)}...` // Log partial key for debugging
      }
    });

    const thawaniResponse = await fetch(thawaniApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'thawani-api-key': thawaniSecretKey
      },
      body: JSON.stringify(thawaniPayload)
    })

    logStep('Thawani API response received', {
      status: thawaniResponse.status,
      statusText: thawaniResponse.statusText,
      headers: Object.fromEntries(thawaniResponse.headers.entries())
    });

    const thawaniData = await thawaniResponse.json()
    
    logStep('Thawani API response data', {
      responseData: thawaniData,
      success: thawaniResponse.ok
    });

    if (!thawaniResponse.ok) {
      logStep('ERROR: Thawani API request failed', {
        status: thawaniResponse.status,
        statusText: thawaniResponse.statusText,
        errorData: thawaniData,
        requestPayload: thawaniPayload
      });
      
      // Enhanced error message based on response
      let errorMessage = 'Failed to create checkout session';
      if (thawaniData.detail) {
        errorMessage += `: ${thawaniData.detail}`;
      }
      if (thawaniResponse.status === 401) {
        errorMessage += ' - Please check your Thawani API credentials (ensure you are using LIVE keys for production)';
      }
      
      throw new Error(errorMessage)
    }

    // LIVE checkout URL
    const checkoutUrl = `https://checkout.thawani.om/pay/${thawaniData.data.session_id}?key=${thawaniPublishableKey}`;
    
    logStep('Checkout session created successfully (LIVE)', {
      sessionId: thawaniData.data.session_id,
      checkoutUrl: checkoutUrl,
      priceOMR: priceInOMR
    });

    return new Response(
      JSON.stringify({ 
        checkout_url: checkoutUrl,
        session_id: thawaniData.data.session_id,
        price_omr: priceInOMR
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERROR: Function execution failed', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
