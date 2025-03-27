
import { useState, useCallback, useEffect, useRef } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession } from '@/lib/types';
import { saveCurrentConversationToStorage, clearCurrentConversationFromStorage, getConversationsFromStorage } from '@/lib/storageUtils';
import { 
  loadExistingConversation, 
  createConversationWithInitialMessage, 
  determineInitialMessage 
} from './utils/conversationInitUtils';
import { useConversationCache } from './useConversationCache';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationInProgress = useRef(false);

  const { startConversation, addMessageToConversation } = useUserData();
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const { getCachedConversation } = useConversationCache(type);

  useEffect(() => {
    // Reset initialization status when auth or type changes
    if (!authUser) {
      setIsInitialized(false);
      initializationInProgress.current = false;
    }
  }, [authUser, type]);

  const initializeChat = useCallback(async (conversationId?: string | null) => {
    if (!authUser) {
      console.log("User not authenticated, cannot initialize chat");
      setError("Authentication required");
      return null;
    }

    if (isInitialized && !loading) {
      console.log(`Chat for ${type} already initialized, using existing session`);
      const cachedConversation = getCachedConversation(authUser.id);
      if (cachedConversation) {
        return cachedConversation;
      }
    }

    if (initializationInProgress.current) {
      console.log(`${type} chat initialization already in progress`);
      return null;
    }

    try {
      initializationInProgress.current = true;
      setLoading(true);
      console.log(`Initializing chat for type: ${type}${conversationId ? ` with existing conversation id: ${conversationId}` : ''}`);
      console.log("User authentication state:", authUser ? "Authenticated" : "Not authenticated");
      
      if (!authUser) {
        console.log("User not authenticated, cannot initialize chat");
        setError("Authentication required");
        return null;
      }

      // Clear any potential stale error
      setError(null);

      // Try to load existing conversation first if ID is provided
      if (conversationId) {
        console.log(`Attempting to load existing conversation: ${conversationId}`);
        try {
          const conversation = await loadExistingConversation(conversationId, authUser.id);
          if (conversation) {
            console.log(`Successfully loaded existing conversation with ${conversation.messages.length} messages`);
            setIsInitialized(true);
            return conversation;
          }
        } catch (error) {
          console.error(`Failed to load existing conversation ${conversationId}:`, error);
          // Clear conversation from storage to avoid loading it again
          clearCurrentConversationFromStorage(type);
          toast({
            title: "Error loading conversation",
            description: "Previous conversation could not be loaded. Starting a new conversation.",
            duration: 5000,
            variant: "destructive"
          });
          
          setError(`Failed to load conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // For all conversation types, create with initial message
      try {
        console.log(`Creating new ${type} conversation with initial message`);
        const initialMessage = determineInitialMessage(type, false);
        const conversation = await createConversationWithInitialMessage(
          type, 
          initialMessage, 
          startConversation, 
          addMessageToConversation
        );
        
        if (!conversation) {
          const errorMessage = `Failed to create ${type} conversation`;
          console.error(errorMessage);
          setError(errorMessage);
          toast({
            title: "Error starting conversation",
            description: "Please try again later.",
            variant: "destructive",
          });
          return null;
        }
        
        console.log(`Successfully created new ${type} conversation`);
        setIsInitialized(true);
        return conversation;
      } catch (err) {
        const errorMessage = `Error starting ${type} conversation: ${err instanceof Error ? err.message : 'Unknown error'}`;
        console.error(errorMessage, err);
        setError(errorMessage);
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
        throw err;
      }
      
    } catch (error) {
      const errorMessage = `Error in initializeChat: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
      initializationInProgress.current = false;
    }
  }, [type, authUser, addMessageToConversation, startConversation, toast, isInitialized, loading, getCachedConversation]);

  return {
    initializeChat,
    loading,
    error
  };
};
