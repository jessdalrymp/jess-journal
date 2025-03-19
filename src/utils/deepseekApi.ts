
import { supabase } from "../integrations/supabase/client";

export interface DeepseekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: DeepseekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function generateDeepseekResponse(
  messages: DeepseekMessage[],
  model = "deepseek-chat"
): Promise<DeepseekResponse> {
  try {
    console.log("Sending messages to DeepSeek API:", 
      messages.map(m => ({role: m.role, contentPreview: m.content.substring(0, 50) + '...'})));
    
    const { data, error } = await supabase.functions.invoke('deepseek', {
      body: { messages, model },
    });

    if (error) {
      console.error("Error invoking DeepSeek edge function:", error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }

    return data as DeepseekResponse;
  } catch (error) {
    console.error("Error generating DeepSeek response:", error);
    throw error;
  }
}

// Helper function to extract just the assistant's message text
export function extractDeepseekResponseText(response: DeepseekResponse): string {
  if (response?.choices?.[0]?.message?.content) {
    return response.choices[0].message.content;
  }
  return "";
}

// Helper function to generate personalized journal prompts based on user history
export async function generatePersonalizedJournalPrompt(
  userId: string
): Promise<string> {
  try {
    // Get the user's previous journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('content, prompt, created_at')
      .eq('user_id', userId)
      .eq('type', 'journal')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (journalError) {
      console.error("Error fetching journal entries:", journalError);
      throw journalError;
    }
    
    // Extract themes and patterns from the entries
    let previousEntries = '';
    if (journalEntries && journalEntries.length > 0) {
      previousEntries = journalEntries.map(entry => 
        `Date: ${new Date(entry.created_at).toLocaleDateString()}\nPrompt: ${entry.prompt}\nContent: ${entry.content.substring(0, 100)}...`
      ).join('\n\n');
    }
    
    // Generate a personalized prompt
    const systemPrompt = `You are Jess, an AI life coach specializing in creating personalized writing prompts.
    Create a unique journaling prompt based on the user's previous journal entries.
    Identify patterns, themes, or areas for further reflection based on what they've written.
    If there are no previous entries, create a general prompt about self-discovery.
    
    Your response should be a single, thought-provoking question or statement.`;
    
    const userPrompt = previousEntries 
      ? `Here are my previous journal entries:\n\n${previousEntries}\n\nBased on these entries, suggest a personalized journaling prompt that will help me go deeper.` 
      : "I'm starting my journaling journey. Suggest a prompt for self-discovery.";
    
    const response = await generateDeepseekResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
    
    return extractDeepseekResponseText(response);
  } catch (error) {
    console.error("Error generating personalized journal prompt:", error);
    return "What patterns have you noticed in how you respond to challenges, and how has your perspective shifted over time?";
  }
}
