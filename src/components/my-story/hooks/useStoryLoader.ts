
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';

/**
 * Hook for initial loading of story conversations
 */
export const useStoryLoader = (setExistingConversationId: (id: string | null) => void, setShowWelcomeModal: (show: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: userLoading } = useAuth();

  // Load existing conversation from storage if available
  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('StoryLoader - Found existing story conversation:', existingConversation.id);
          setExistingConversationId(existingConversation.id);
        } else {
          console.log('StoryLoader - No existing story conversation found');
          // Check user preference for welcome modal
          const hideWelcomeModal = localStorage.getItem('hideMyStoryWelcome') === 'true';
          setShowWelcomeModal(!hideWelcomeModal);
        }
      } catch (error) {
        console.error('StoryLoader - Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
    }
  }, [user, setExistingConversationId, setShowWelcomeModal]);

  return {
    isLoading,
    userLoading
  };
};
