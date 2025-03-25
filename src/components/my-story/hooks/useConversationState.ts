
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCurrentConversationFromStorage, clearCurrentConversationFromStorage } from '@/lib/storageUtils';
import { useToast } from '@/hooks/use-toast';

export const useConversationState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load existing conversation from storage if available
  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('MyStoryState - Found existing story conversation:', existingConversation.id);
          setExistingConversationId(existingConversation.id);
        } else {
          console.log('MyStoryState - No existing story conversation found');
        }
      } catch (error) {
        console.error('MyStoryState - Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  // Clear any conversation error
  const clearConversationError = useCallback(() => {
    setConversationError(null);
  }, []);

  const handleStartFresh = async () => {
    if (existingConversationId || conversationError) {
      console.log('MyStoryState - Starting fresh conversation');
      clearCurrentConversationFromStorage('story');
      setConversationError(null);
      
      toast({
        title: "New Story Started",
        description: "Your previous story was saved and a new conversation has been started.",
      });
      
      setExistingConversationId(null);
      window.location.reload();
    }
  };

  return {
    isLoading,
    existingConversationId,
    setExistingConversationId,
    conversationError,
    setConversationError,
    isLoadingConversation,
    setIsLoadingConversation,
    clearConversationError,
    handleStartFresh
  };
};
