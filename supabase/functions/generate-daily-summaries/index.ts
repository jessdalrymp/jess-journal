
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, createClient, supabaseUrl, supabaseServiceKey } from "./helpers.ts";
import { generateDailySummary } from "./summaryGenerator.ts";

// Create Supabase client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting daily journal summary generation");
    
    // Get all entries from the current day grouped by user
    const { data: userEntries, error: entriesError } = await supabaseAdmin
      .rpc('get_entries_from_current_day')
      .execute();
    
    if (entriesError) {
      throw new Error(`Error fetching daily entries: ${entriesError.message}`);
    }
    
    console.log(`Found entries for ${userEntries.length} users to summarize`);
    
    // Process each user's entries
    const summaryResults = [];
    
    for (const userEntry of userEntries) {
      const { user_id, entries } = userEntry;
      
      // Generate summary for this user's entries
      const summary = await generateDailySummary(user_id, entries);
      
      if (summary) {
        summaryResults.push({
          user_id,
          summary
        });
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated summaries for ${summaryResults.length} users`,
        summaries: summaryResults
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in generate-daily-summaries function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
