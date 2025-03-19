
import { useState, useCallback, useEffect, useRef } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ConversationSession } from '@/lib/types';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';
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

  const initializeChat = useCallback(async (conversationId?: string | null) => {
    if (isInitialized && !loading) {
      console.log(`Chat for ${type} already initialized, using existing session`);
      const cachedConversation = getCachedConversation(authUser?.id || '');
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

      if (conversationId) {
        console.log(`Attempting to load existing conversation: ${conversationId}`);
        const conversation = await loadExistingConversation(conversationId, authUser.id);
        if (conversation) {
          console.log(`Successfully loaded existing conversation with ${conversation.messages.length} messages`);
          setIsInitialized(true);
          return conversation;
        } else {
          console.log(`Failed to load existing conversation ${conversationId}, will create new conversation`);
        }
      }
      
      const cachedConversation = getCachedConversation(authUser.id);
      if (cachedConversation) {
        console.log(`Using cached conversation for ${type}`);
        setIsInitialized(true);
        return cachedConversation;
      }
      
      if (type === 'sideQuest' || type === 'action') {
        try {
          console.log(`Creating new ${type} conversation with initial message`);
          const initialMessage = determineInitialMessage(type, false);
          const conversation = await createConversationWithInitialMessage(
            type, 
            initialMessage, 
            startConversation, 
            addMessageToConversation
          );
          
          console.log(`Successfully created new ${type} conversation`);
          setIsInitialized(true);
          return conversation;
        } catch (err) {
          console.error(`Error starting ${type} conversation:`, err);
          setError(`Failed to initialize ${type} chat`);
          throw err;
        }
      }
      
      try {
        console.log(`Starting new ${type} conversation from API`);
        const conversation = await startConversation(type);
        
        if (!conversation.messages || conversation.messages.length === 0) {
          const isStoryType = type === 'story';
          const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
          const isFirstVisit = isStoryType && !hasVisitedStoryPage;
          
          console.log(`Adding initial message to new ${type} conversation`);
          const initialMessage = determineInitialMessage(type, isFirstVisit);
          
          await addMessageToConversation(
            conversation.id,
            initialMessage,
            'assistant' as const
          );
          
          const updatedSession: ConversationSession = {
            ...conversation,
            messages: [
              {
                id: Date.now().toString(),
                role: 'assistant' as const,
                content: initialMessage,
                timestamp: new Date(),
              },
            ],
          };
          
          saveCurrentConversationToStorage(updatedSession);
          setIsInitialized(true);
          return updatedSession;
        }
        
        setIsInitialized(true);
        return conversation;
      } catch (err) {
        console.error('Error initializing chat:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to initialize chat");
        }
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
      setError("Failed to initialize chat");
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
