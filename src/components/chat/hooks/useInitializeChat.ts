import { useState, useCallback } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useConversationActions } from '@/hooks/useConversationActions';
import { getCurrentConversationFromStorage, saveCurrentConversationToStorage, clearCurrentConversationFromStorage } from '@/lib/storageUtils';
import { getInitialMessage } from '../chatUtils';
import { fetchConversation } from '@/services/conversation/fetchConversations';
import { useToast } from '@/hooks/use-toast';
import { createConversationWithInitialMessage, loadExistingConversation } from './utils/conversationInitUtils';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { startConversation, addMessageToConversation } = useConversationActions();
  const { toast } = useToast();

  const initializeChat = useCallback(async (conversationId?: string | null): Promise<ConversationSession | null> => {
    if (!user || !user.id) {
      console.error('User not authenticated');
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Initializing chat for type: ${type}${conversationId ? ` with existing conversation id: ${conversationId}` : ''}`);
      
      // If a specific conversation ID is passed, load that conversation
      if (conversationId) {
        console.log(`Attempting to load existing conversation: ${conversationId}`);
        try {
          const session = await loadExistingConversation(conversationId, user.id);
          return session;
        } catch (error) {
          console.error(`Error loading conversation ${conversationId}:`, error);
          throw new Error(`Failed to load conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Otherwise, look for an existing conversation in storage or create a new one
      const existingConversation = getCurrentConversationFromStorage(type);
      
      if (existingConversation && existingConversation.userId === user.id && existingConversation.messages.length > 0) {
        console.log(`Found existing conversation in storage for ${type}`, existingConversation);
        return existingConversation;
      }
      
      // Clear any stale conversation data
      clearCurrentConversationFromStorage(type);
      
      // Create a new conversation with initial message
      console.log(`Creating new ${type} conversation for user ${user.id}`);
      
      try {
        // Create new conversation with initial message
        const session = await createConversationWithInitialMessage(
          type,
          user.id,
          startConversation,
          addMessageToConversation
        );
        
        if (!session) {
          throw new Error('Failed to create conversation session');
        }
        
        return session;
      } catch (error) {
        console.error('Error starting new conversation:', error);
        throw new Error(`Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Error initializing conversation",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, type, startConversation, addMessageToConversation, toast]);

  return {
    initializeChat,
    loading,
    error
  };
};
