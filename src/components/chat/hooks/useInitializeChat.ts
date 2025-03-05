import { useState, useCallback } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { getInitialMessage } from '../chatUtils';
import {
  saveCurrentConversationToStorage,
  getCurrentConversationFromStorage
} from '@/lib/storageUtils';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { startConversation, addMessageToConversation } = useUserData();
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const initializeChat = useCallback(async () => {
    if (isInitialized) {
      console.log("Chat already initialized, using existing session");
      const existingSession = getCurrentConversationFromStorage(type);
      return existingSession;
    }

    try {
      setLoading(true);
      console.log("Initializing chat for type:", type);
      console.log("User authentication state:", authUser ? "Authenticated" : "Not authenticated");
      
      if (!authUser) {
        console.log("User not authenticated, cannot initialize chat");
        setError("Authentication required");
        setLoading(false);
        return null;
      }
      
      if (type === 'sideQuest') {
        const cachedConversation = getCurrentConversationFromStorage(type);
        
        if (
          cachedConversation && 
          cachedConversation.userId === authUser.id && 
          cachedConversation.messages && 
          cachedConversation.messages.length >= 1
        ) {
          console.log('Using existing sideQuest conversation from cache');
          setIsInitialized(true);
          setLoading(false);
          return cachedConversation;
        }
        
        console.log('No valid cached sideQuest conversation, creating new one');
        const conversation = await startConversation(type);
        
        const initialMessage = getInitialMessage(type);
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
        setLoading(false);
        return updatedSession;
      }
      
      const cachedConversation = getCurrentConversationFromStorage(type);
      if (cachedConversation && cachedConversation.userId === authUser.id) {
        console.log(`Loaded ${type} conversation from localStorage`);
        setLoading(false);
        return cachedConversation;
      }
      
      try {
        const conversation = await startConversation(type);
        
        if (!conversation.messages || conversation.messages.length === 0) {
          const isStoryType = type === 'story';
          const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
          const isFirstVisit = isStoryType && !hasVisitedStoryPage;
          
          if (!isFirstVisit) {
            const initialMessage = getInitialMessage(type);
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
            return updatedSession;
          } else {
            const briefIntro = "I'm excited to hear your story! What would you like to talk about today?";
            await addMessageToConversation(
              conversation.id,
              briefIntro,
              'assistant' as const
            );
            
            const updatedSession: ConversationSession = {
              ...conversation,
              messages: [
                {
                  id: Date.now().toString(),
                  role: 'assistant' as const,
                  content: briefIntro,
                  timestamp: new Date(),
                },
              ],
            };
            
            saveCurrentConversationToStorage(updatedSession);
            return updatedSession;
          }
        }
        
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
    }
  }, [type, authUser, addMessageToConversation, startConversation, toast, isInitialized]);

  return {
    initializeChat,
    loading,
    error
  };
};
