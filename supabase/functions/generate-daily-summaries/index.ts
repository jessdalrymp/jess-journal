
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for the edge function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://uobvlrobwohdlfbhniho.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create Supabase client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to create a client
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      select: (query) => ({
        eq: (column, value) => ({
          execute: async () => {
            const url = `${supabaseUrl}/rest/v1/${table}?select=${query}&${column}=eq.${value}`;
            const response = await fetch(url, {
              headers: {
                "Content-Type": "application/json",
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
              },
            });
            if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
            return { data: await response.json(), error: null };
          }
        }),
        execute: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${query}`;
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
            },
          });
          if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
          return { data: await response.json(), error: null };
        }
      }),
      insert: (data) => ({
        execute: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
              "Prefer": "return=minimal",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error(`Error inserting data: ${response.statusText}`);
          return { data: await response.json(), error: null };
        }
      })
    }),
    rpc: (func, params) => ({
      execute: async () => {
        const url = `${supabaseUrl}/rest/v1/rpc/${func}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(params || {}),
        });
        if (!response.ok) throw new Error(`Error calling RPC: ${response.statusText}`);
        return { data: await response.json(), error: null };
      }
    })
  };
}

// Generate a summary for a user's daily journal entries
async function generateDailySummary(userId, entriesContent) {
  try {
    console.log(`Generating daily summary for user ${userId} with ${entriesContent.length} entries`);
    
    // Only generate summary if there are entries
    if (entriesContent.length === 0) {
      console.log(`No entries for user ${userId} today, skipping summary`);
      return null;
    }
    
    // Format entries for the summary
    const formattedEntries = entriesContent.map(entry => {
      return `Entry ${new Date(entry.created_at).toLocaleTimeString()}: ${entry.prompt}\n${entry.content.substring(0, 300)}${entry.content.length > 300 ? '...' : ''}`;
    }).join('\n\n');
    
    // Construct a message for the AI model
    const messages = [
      {
        role: "system", 
        content: "You are a journal summary assistant. Create a concise summary of the user's journal entries for the day, highlighting key themes, insights, and patterns. Format your response as JSON with fields for 'title' and 'summary'."
      },
      {
        role: "user",
        content: `Here are my journal entries for today:\n\n${formattedEntries}\n\nPlease create a daily summary that captures the key themes and insights from these entries.`
      }
    ];

    // Call DeepSeek API to generate the summary
    const response = await fetch(`${supabaseUrl}/functions/v1/deepseek`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    const result = await response.json();
    const summaryText = result.choices[0].message.content;
    
    // Format the summary content
    let title = `Daily Journal Summary: ${new Date().toLocaleDateString()}`;
    let summary = summaryText;
    
    try {
      // Try to extract JSON if present
      const jsonMatch = summaryText.match(/```json\s*([\s\S]*?)```/) || 
                        summaryText.match(/\{[\s\S]*?\}/);
      
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
        if (parsedJson.title) title = parsedJson.title;
        if (parsedJson.summary) summary = parsedJson.summary;
      }
    } catch (e) {
      console.log('Could not parse JSON from summary, using raw text');
    }
    
    // Create the content for the new journal entry
    const journalContent = JSON.stringify({
      title: title,
      summary: summary,
      type: 'summary'
    }, null, 2);
    
    // Save the summary as a new journal entry
    const { error: insertError } = await supabaseAdmin
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: `Daily Summary: ${new Date().toLocaleDateString()}`,
        content: `\`\`\`json\n${journalContent}\n\`\`\``,
        type: 'summary'
      })
      .execute();
    
    if (insertError) {
      console.error(`Error saving summary for user ${userId}:`, insertError);
      return null;
    }
    
    console.log(`Successfully created daily summary for user ${userId}`);
    return { title, summary };
  } catch (error) {
    console.error(`Error generating summary for user ${userId}:`, error);
    return null;
  }
}

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
