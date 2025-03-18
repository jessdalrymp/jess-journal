
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
    
    // Verify admin role
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if user is admin
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('check_is_admin')
    
    if (adminCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }
    
    const { paymentId, squarePaymentId } = await req.json()

    if (!paymentId || !squarePaymentId) {
      return new Response(
        JSON.stringify({ error: 'paymentId and squarePaymentId are required' }),
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
      console.error('Could not retrieve Square API key:', apiKeyError)
      throw new Error('Could not retrieve Square API key')
    }

    const SQUARE_ACCESS_TOKEN = apiKeyData.api_key
    const SQUARE_API_URL = Deno.env.get('SQUARE_ENV') === 'production' 
      ? 'https://connect.squareup.com/v2'
      : 'https://connect.squareupsandbox.com/v2'
    
    // Generate a unique idempotency key for this refund
    const idempotencyKey = crypto.randomUUID()
    
    // Get payment details from database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()
    
    if (paymentError || !paymentData) {
      console.error('Payment not found:', paymentError)
      throw new Error('Payment not found or could not be retrieved')
    }
    
    if (paymentData.refunded_at) {
      throw new Error('This payment has already been refunded')
    }
    
    // Process refund with Square API
    console.log(`Processing refund for payment ${paymentId} with Square payment ID ${squarePaymentId}`)
    
    // For Square Payment Links, we need to get the payment ID from the payment link first
    const getPaymentResponse = await fetch(`${SQUARE_API_URL}/square/payment-links/${squarePaymentId}`, {
      method: 'GET',
      headers: {
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    const paymentLinkData = await getPaymentResponse.json()
    console.log('Payment link data:', paymentLinkData)
    
    if (!getPaymentResponse.ok) {
      console.error('Error getting payment details:', paymentLinkData)
      throw new Error(`Failed to get payment details: ${JSON.stringify(paymentLinkData.errors || paymentLinkData)}`)
    }
    
    const orderId = paymentLinkData?.payment_link?.order_id
    if (!orderId) {
      throw new Error('Could not retrieve order ID from payment link')
    }
    
    // Get the payment ID from the order
    const getOrderResponse = await fetch(`${SQUARE_API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    const orderData = await getOrderResponse.json()
    console.log('Order data:', orderData)
    
    if (!getOrderResponse.ok) {
      console.error('Error getting order details:', orderData)
      throw new Error(`Failed to get order details: ${JSON.stringify(orderData.errors || orderData)}`)
    }
    
    const tenderIds = orderData.order?.tenders?.map((tender: any) => tender.id) || []
    if (tenderIds.length === 0) {
      throw new Error('No payment tenders found for this order')
    }
    
    // Process refund for each tender
    const refundResults = []
    for (const tenderId of tenderIds) {
      const refundResponse = await fetch(`${SQUARE_API_URL}/refunds`, {
        method: 'POST',
        headers: {
          'Square-Version': '2023-12-13',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: `${idempotencyKey}-${tenderId}`,
          payment_id: tenderId,
          amount_money: {
            amount: paymentData.amount,
            currency: paymentData.currency
          },
          reason: 'Admin initiated refund'
        })
      })
      
      const refundData = await refundResponse.json()
      console.log(`Refund response for tender ${tenderId}:`, refundData)
      
      refundResults.push({
        tenderId,
        success: refundResponse.ok,
        data: refundData
      })
      
      if (!refundResponse.ok) {
        console.error(`Error processing refund for tender ${tenderId}:`, refundData)
      }
    }
    
    // Check if any refund was successful
    const anyRefundSuccessful = refundResults.some(result => result.success)
    
    if (anyRefundSuccessful) {
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
      
      if (updateError) {
        console.error('Error updating payment status:', updateError)
        // We still consider the refund successful even if the DB update fails
      }
      
      // If subscription is associated with this payment, handle subscription cancellation
      if (paymentData.user_id) {
        // Get user's subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', paymentData.user_id)
          .single()
        
        if (!subscriptionError && subscriptionData) {
          // Update subscription status if needed
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', paymentData.user_id)
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          refund_results: refundResults,
          message: 'Refund processed successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      throw new Error(`Failed to process refund: ${JSON.stringify(refundResults)}`)
    }
  } catch (error) {
    console.error('Refund error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
