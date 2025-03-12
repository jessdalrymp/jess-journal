
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request data
    const { subscriptionId, deleteUserData = false } = await req.json();

    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: "Subscription ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*, user_id")
      .eq("id", subscriptionId)
      .single();

    if (fetchError || !subscription) {
      return new Response(
        JSON.stringify({ error: "Subscription not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const userId = subscription.user_id;

    // If deleteUserData is true, delete all user data
    if (deleteUserData && userId) {
      console.log(`Deleting data for user: ${userId}`);
      
      try {
        // Delete all user data from various tables
        // Process each deletion independently to ensure partial completion if one fails
        
        // Delete journal entries
        const { error: journalError } = await supabase
          .from("journal_entries")
          .delete()
          .eq("user_id", userId);
        
        if (journalError) {
          console.error("Error deleting journal entries:", journalError);
        }
        
        // Delete conversations and messages
        const { data: conversations, error: convError } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", userId);
        
        if (!convError && conversations && conversations.length > 0) {
          // Delete messages from each conversation
          for (const conv of conversations) {
            const { error: messagesError } = await supabase
              .from("messages")
              .delete()
              .eq("conversation_id", conv.id);
            
            if (messagesError) {
              console.error(`Error deleting messages for conversation ${conv.id}:`, messagesError);
            }
          }
          
          // Delete the conversations
          const { error: deleteConvError } = await supabase
            .from("conversations")
            .delete()
            .eq("user_id", userId);
          
          if (deleteConvError) {
            console.error("Error deleting conversations:", deleteConvError);
          }
        }
        
        // Delete user profile
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);
        
        if (profileError) {
          console.error("Error deleting profile:", profileError);
        }
        
        // Delete user challenges
        const { error: challengesError } = await supabase
          .from("user_challenges")
          .delete()
          .eq("user_id", userId);
        
        if (challengesError) {
          console.error("Error deleting user challenges:", challengesError);
        }
        
        // Delete any other subscription records
        const { error: subsError } = await supabase
          .from("subscriptions")
          .delete()
          .eq("user_id", userId);
        
        if (subsError) {
          console.error("Error deleting other subscriptions:", subsError);
        }
        
        // Finally, delete the user from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        
        if (authError) {
          console.error("Error deleting user from auth:", authError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Failed to delete user account",
              message: "Subscription cancelled but user account deletion failed" 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }

        console.log(`Successfully deleted user ${userId} and all associated data`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Subscription cancelled and user account deleted successfully" 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      } catch (deleteError) {
        console.error("Error during user data deletion:", deleteError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to delete user data",
            message: "Subscription cancelled but user data deletion failed" 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } else {
      // Just update the subscription to cancelled without deleting user data
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          status: "cancelled",
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);

      if (updateError) {
        console.error("Error cancelling subscription:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to cancel subscription" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Successfully cancelled the subscription
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Subscription cancelled successfully" 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
