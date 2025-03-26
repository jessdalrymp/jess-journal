
import { useState, useEffect } from 'react';

export const useWelcomeModal = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const checkWelcomePreference = () => {
    const dontShowWelcome = localStorage.getItem('dontShowStoryWelcome');
    return dontShowWelcome !== 'true';
  };
  
  const initializeWelcomeModal = (hasExistingConversation: boolean) => {
    if (!hasExistingConversation && checkWelcomePreference()) {
      setShowWelcomeModal(true);
    }
  };
  
  return {
    showWelcomeModal,
    setShowWelcomeModal,
    initializeWelcomeModal
  };
};
