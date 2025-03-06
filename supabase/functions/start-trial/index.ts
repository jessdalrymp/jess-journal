
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if the user already has a subscription
    const { data: existingSub, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (subError && subError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      throw subError
    }

    if (existingSub) {
      if (existingSub.status === 'active') {
        return new Response(
          JSON.stringify({ message: 'User already has an active subscription' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }

    // Create trial subscription
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialStartDate.getDate() + 7) // 7-day trial instead of 14

    const subscriptionId = crypto.randomUUID()
    
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .upsert(
        {
          id: subscriptionId,
          user_id: userId,
          status: 'active',
          is_trial: true,
          trial_ends_at: trialEndDate.toISOString(),
          created_at: trialStartDate.toISOString(),
          updated_at: trialStartDate.toISOString(),
          current_period_ends_at: trialEndDate.toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, trial_ends_at: trialEndDate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
