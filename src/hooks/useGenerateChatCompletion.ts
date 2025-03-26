
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to generate chat completions using the backend API
 */
export const useGenerateChatCompletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generate a completion from OpenAI based on messages
   */
  const generateCompletion = useCallback(async (messages: ChatMessage[] | { role: string, content: string }[]): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating completion with messages:', messages);
      
      // Call the Supabase function that wraps our AI provider
      const { data, error } = await supabase.functions.invoke('deepseek', {
        body: { messages }
      });
      
      if (error) {
        console.error('Error generating completion:', error);
        throw new Error(`Failed to generate completion: ${error.message}`);
      }
      
      if (!data || !data.completion) {
        throw new Error('No completion received from the API');
      }
      
      console.log('Received completion:', data.completion);
      return data.completion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error generating completion';
      console.error('Error in generateCompletion:', errorMessage);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateCompletion,
    loading,
    error
  };
};
