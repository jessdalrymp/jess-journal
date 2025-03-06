
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
    
    const { userId, couponCode } = await req.json()

    if (!userId || !couponCode) {
      return new Response(
        JSON.stringify({ error: 'userId and couponCode are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if the coupon exists and is valid
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('is_active', true)
      .single()

    if (couponError) {
      return new Response(
        JSON.stringify({ error: 'Invalid coupon code', valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if coupon is expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Coupon has expired', valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if coupon has reached maximum uses
    if (!coupon.is_unlimited && coupon.current_uses >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ error: 'Coupon has reached maximum uses', valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Increment coupon usage
    if (!coupon.is_unlimited) {
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ current_uses: (coupon.current_uses || 0) + 1 })
        .eq('id', coupon.id)

      if (updateError) {
        throw updateError
      }
    }

    let subscriptionUpdate = {}
    
    // Special handling for different coupon codes
    if (couponCode === 'UNLIMITED2024') {
      subscriptionUpdate = {
        status: 'active',
        is_trial: false,
        is_unlimited: true,
        coupon_code: couponCode,
        updated_at: new Date().toISOString()
      }
    } else if (couponCode === 'FreeTrial') {
      // Set trial end date to 30 days from now for FreeTrial coupon
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30)
      
      subscriptionUpdate = {
        status: 'active',
        is_trial: true,
        is_unlimited: false,
        trial_ends_at: trialEndDate.toISOString(),
        coupon_code: couponCode,
        updated_at: new Date().toISOString()
      }
    } else {
      // For other coupons, you could apply different logic
      // For example, extend trial period, give discount, etc.
      return new Response(
        JSON.stringify({ error: 'Unsupported coupon code', valid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if user already has a subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingSub) {
      // Update existing subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .update(subscriptionUpdate)
        .eq('user_id', userId)

      if (subError) throw subError
    } else {
      // Create new subscription
      const subscriptionId = crypto.randomUUID()
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          id: subscriptionId,
          user_id: userId,
          created_at: new Date().toISOString(),
          ...subscriptionUpdate
        })

      if (subError) throw subError
    }

    return new Response(
      JSON.stringify({ success: true, valid: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, valid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
