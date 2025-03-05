
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
