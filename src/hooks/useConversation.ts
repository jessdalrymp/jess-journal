
import { useState, useCallback } from 'react';
import { updateConversationTitle, updateConversationSummary } from '@/services/conversation/manageConversations';
import { fetchConversation } from '@/services/conversation/fetchConversations';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for conversation management
 */
export const useConversation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update the title of a conversation
  const updateTitle = useCallback(async (conversationId: string, title: string) => {
    setLoading(true);
    try {
      console.log(`Updating title for conversation ${conversationId} to "${title}"`);
      const success = await updateConversationTitle(conversationId, title);
      
      if (!success) {
        throw new Error('Failed to update conversation title');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      toast({
        title: 'Error updating title',
        description: 'The conversation title could not be updated',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update the summary of a conversation
  const updateSummary = useCallback(async (conversationId: string, summary: string) => {
    setLoading(true);
    try {
      console.log(`Updating summary for conversation ${conversationId}`);
      const success = await updateConversationSummary(conversationId, summary);
      
      if (!success) {
        throw new Error('Failed to update conversation summary');
      }
      
      return success;
    } catch (error) {
      console.error('Error updating conversation summary:', error);
      toast({
        title: 'Error updating summary',
        description: 'The conversation summary could not be updated',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch a conversation by ID
  const getConversation = useCallback(async (conversationId: string, userId: string) => {
    setLoading(true);
    try {
      console.log(`Fetching conversation ${conversationId} for user ${userId}`);
      const conversation = await fetchConversation(conversationId, userId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: 'Error loading conversation',
        description: 'The conversation could not be loaded',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    updateConversationTitle: updateTitle,
    updateConversationSummary: updateSummary,
    getConversation
  };
};
