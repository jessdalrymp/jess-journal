
import { useState, useCallback, useEffect, useRef } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ConversationSession } from '@/lib/types';
import { saveCurrentConversationToStorage, clearCurrentConversationFromStorage, getConversationsFromStorage, getCurrentConversationFromStorage } from '@/lib/storageUtils';
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

      // First, check for conversation in local storage
      const storedConversation = getCurrentConversationFromStorage(type);
      if (storedConversation && storedConversation.messages.length > 0) {
        console.log(`Found stored ${type} conversation with ${storedConversation.messages.length} messages`);
        setIsInitialized(true);
        return storedConversation;
      }

      // Try to load existing conversation if ID is provided
      if (conversationId) {
        console.log(`Attempting to load existing conversation: ${conversationId}`);
        const conversation = await loadExistingConversation(conversationId, authUser.id);
        if (conversation) {
          console.log(`Successfully loaded existing conversation with ${conversation.messages.length} messages`);
          setIsInitialized(true);
          return conversation;
        } else {
          console.log(`Failed to load existing conversation ${conversationId}, will create new conversation`);
          toast({
            title: "Starting new conversation",
            description: "Previous conversation could not be loaded",
            duration: 3000,
          });
        }
      }
      
      // Try to get cached conversation from storage
      const storedConversations = getConversationsFromStorage();
      const typeConversations = storedConversations.filter(
        c => c.type === type && c.userId === authUser.id
      );
      
      if (typeConversations.length > 0) {
        // Sort by most recent
        const mostRecentConversation = typeConversations.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        })[0];
        
        if (mostRecentConversation && mostRecentConversation.messages && mostRecentConversation.messages.length > 0) {
          console.log(`Using stored conversation for ${type}`);
          setIsInitialized(true);
          return mostRecentConversation;
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
        
        console.log(`Successfully created new ${type} conversation`);
        setIsInitialized(true);
        return conversation;
      } catch (err) {
        console.error(`Error starting ${type} conversation:`, err);
        setError(`Failed to initialize ${type} chat`);
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
        throw err;
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
