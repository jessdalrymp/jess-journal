
import { useCallback, useState } from 'react';
import { useGenerateChatCompletion } from '@/hooks/useGenerateChatCompletion';
import { useUserData } from '@/context/UserDataContext';
import { ChatMessage } from '@/lib/types';
import { useConversation } from '@/hooks/useConversation';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to generate a title and summary from chat messages
 */
export const useGenerateSummary = (
  conversationId: string | null,
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onComplete?: () => void
) => {
  const [generating, setGenerating] = useState(false);
  const { generateCompletion, loading } = useGenerateChatCompletion();
  const { user } = useUserData();
  const { updateConversationTitle, updateConversationSummary } = useConversation();
  
  const generateTitleAndSummary = useCallback(async (
    messages: ChatMessage[], 
    customTitle?: string
  ) => {
    if (!user || !conversationId) return;
    
    try {
      setGenerating(true);
      
      // If custom title is provided, use it instead of generating one
      let title = customTitle;
      
      // Only generate if we don't have a custom title
      if (!title) {
        // First, generate a title using OpenAI
        const titlePrompt = `
        Generate a short, descriptive title (maximum 5 words) for this ${type} conversation.
        Just respond with the title, nothing else. No quotes or additional text.
        `;
        
        const titleMessages = [
          { role: 'system', content: titlePrompt },
          ...messages.slice(0, Math.min(messages.length, 10)) // Use first 10 messages at most
        ];
        
        title = await generateCompletion(titleMessages);
        
        // Clean up and truncate the title if needed
        title = title.replace(/^"(.+)"$/, '$1').trim(); // Remove quotes if present
        title = title.substring(0, 50); // Limit length
      }
      
      // Update the conversation title
      await updateConversationTitle(conversationId, title);
      
      // Generate a summary using OpenAI
      const summaryPrompt = `
      Create a detailed summary of this ${type} conversation.
      Include the key points and themes discussed.
      Format your response as a coherent paragraph, not a list.
      `;
      
      const summaryMessages = [
        { role: 'system', content: summaryPrompt },
        ...messages // Use all messages for the summary
      ];
      
      const summary = await generateCompletion(summaryMessages);
      
      // Update the conversation summary
      await updateConversationSummary(conversationId, summary);
      
      console.log("Creating journal entry from conversation with ID:", conversationId);
      
      // Create a journal entry with the conversation
      const journalEntryId = await createJournalEntryFromConversation(
        user.id,
        conversationId,
        title,
        summary
      );
      
      console.log("Journal entry created with ID:", journalEntryId);
      
      if (onComplete) {
        onComplete();
      }
      
      return { title, summary };
    } catch (error) {
      console.error('Error generating title and summary:', error);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, [user, conversationId, type, generateCompletion, updateConversationTitle, updateConversationSummary, onComplete]);
  
  /**
   * Creates a journal entry from a conversation
   */
  const createJournalEntryFromConversation = async (
    userId: string,
    conversationId: string,
    title: string,
    summary: string
  ) => {
    try {
      console.log('Creating journal entry from conversation:', {
        userId,
        conversationId,
        title
      });
      
      // Insert a new journal entry with reference to the conversation
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          prompt: title,
          content: summary,
          type: 'story'
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating journal entry:', error);
        throw error;
      }
      
      console.log('Successfully created journal entry with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error in createJournalEntryFromConversation:', error);
      throw error;
    }
  };
  
  return {
    generateTitleAndSummary,
    generating: generating || loading
  };
};
