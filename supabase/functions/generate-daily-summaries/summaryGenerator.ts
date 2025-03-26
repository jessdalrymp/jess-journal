
import { createClient, supabaseUrl, supabaseServiceKey } from "./helpers.ts";

// Create Supabase client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types for entries
interface JournalEntry {
  id: string;
  prompt: string;
  content: string;
  created_at: string;
  type?: string;
  conversation_id?: string | null;
}

interface SummaryResult {
  title: string;
  summary: string;
}

// Generate a summary for a user's daily journal entries
export async function generateDailySummary(userId: string, entriesContent: JournalEntry[]): Promise<SummaryResult | null> {
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
    
    // Construct a message for the AI model with emphasis on brevity
    const messages = [
      {
        role: "system", 
        content: "You are a journal summary assistant. Create an extremely brief summary of the user's journal entries for the day, mentioning only the key topics discussed. Format your response as JSON with fields for 'title' and 'summary'. Keep the summary under 50 words."
      },
      {
        role: "user",
        content: `Here are my journal entries for today:\n\n${formattedEntries}\n\nPlease create a very brief daily summary that captures only the main topics discussed.`
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
