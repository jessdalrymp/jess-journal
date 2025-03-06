
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
    const url = new URL(req.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the payment status
    await supabase
      .from('payments')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'pending')

    // Update or create subscription
    const currentDate = new Date()
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(currentDate.getMonth() + 1) // 1 month subscription

    // Get existing subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    const subscriptionData = {
      user_id: userId,
      status: 'active',
      is_trial: false,
      current_period_ends_at: nextBillingDate.toISOString(),
      updated_at: currentDate.toISOString()
    }

    if (existingSub) {
      // Update existing subscription
      await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId)
    } else {
      // Create new subscription
      const subscriptionId = crypto.randomUUID()
      await supabase
        .from('subscriptions')
        .insert({
          id: subscriptionId,
          ...subscriptionData,
          created_at: currentDate.toISOString()
        })
    }

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${Deno.env.get('APP_URL')}/subscription?success=true`,
      },
    })
  } catch (error) {
    console.error('Payment success handler error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
