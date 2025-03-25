
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';

export const useWelcomeModalState = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { user } = useAuth();
  
  // Check if welcome modal should be shown
  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        if (!existingConversation) {
          // Check user preference for welcome modal
          const hideWelcomeModal = localStorage.getItem('hideMyStoryWelcome') === 'true';
          setShowWelcomeModal(!hideWelcomeModal);
        }
      } catch (error) {
        console.error('WelcomeModalState - Error checking welcome preferences:', error);
      }
    }
  }, [user]);

  // Handle "Don't show again" preference
  const handleDontShowWelcomeAgain = (dontShow: boolean) => {
    if (dontShow) {
      localStorage.setItem('hideMyStoryWelcome', 'true');
    } else {
      localStorage.removeItem('hideMyStoryWelcome');
    }
  };

  return {
    showWelcomeModal,
    setShowWelcomeModal,
    handleDontShowWelcomeAgain
  };
};
