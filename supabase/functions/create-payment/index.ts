
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { userId, amount, currency, description } = await req.json()

    if (!userId || !amount || !currency) {
      return new Response(
        JSON.stringify({ error: 'userId, amount, and currency are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the Square API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service_name', 'square')
      .single()

    if (apiKeyError) {
      throw new Error('Could not retrieve Square API key')
    }

    const SQUARE_ACCESS_TOKEN = apiKeyData.api_key
    const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID') ?? ''
    const SQUARE_API_URL = Deno.env.get('SQUARE_ENV') === 'production' 
      ? 'https://connect.squareup.com/v2'
      : 'https://connect.squareupsandbox.com/v2'
    
    // Generate a unique idempotency key for this payment
    const idempotencyKey = crypto.randomUUID()
    
    // Create payment with Square API
    const squareResponse = await fetch(`${SQUARE_API_URL}/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey,
        quick_pay: {
          name: description || 'Jess AI Premium Subscription',
          price_money: {
            amount: amount,
            currency: currency
          },
          location_id: SQUARE_LOCATION_ID
        },
        checkout_options: {
          redirect_url: `${Deno.env.get('APP_URL')}/payment-success?user_id=${userId}`,
          ask_for_shipping_address: false
        },
        pre_populated_data: {
          buyer_email: ''  // Can be populated with user's email if available
        }
      })
    })

    const squareData = await squareResponse.json()
    
    if (!squareResponse.ok) {
      throw new Error(`Square API error: ${JSON.stringify(squareData)}`)
    }

    // Store payment info in database
    const paymentId = crypto.randomUUID()
    
    const { error: paymentStoreError } = await supabase
      .from('payments')
      .insert({
        id: paymentId,
        user_id: userId,
        amount: amount,
        currency: currency,
        description: description || 'Monthly subscription',
        status: 'pending',
        square_payment_id: squareData.payment_link?.id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (paymentStoreError) {
      throw paymentStoreError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment_id: paymentId,
        payment_url: squareData.payment_link?.url 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
