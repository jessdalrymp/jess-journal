import { useState } from 'react';
import { useConversationActions } from './useConversationActions';
import { useToast } from '@/hooks/use-toast';

export function useConversationData(userId?: string | null) {
  const conversationActions = useConversationActions();
  const { toast } = useToast();
  
  const loading = conversationActions.loading;

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      return await conversationActions.startConversation(userId, type);
    } catch (error) {
      console.error(`Error starting ${type} conversation:`, error);
      toast({
        title: `Error starting ${type}`,
        description: "Please try again later",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    try {
      const result = await conversationActions.addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        return true;
      }
      return result;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      toast({
        title: "Error saving message",
        description: "Your message might not have been saved",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    loading,
    startConversation,
    addMessageToConversation
  };
}
