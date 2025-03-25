
import { useState } from 'react';

/**
 * Hook for managing the modals in the My Story feature
 */
export const useStoryModal = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);

  // Handle "Don't show again" preference
  const handleDontShowWelcomeAgain = (dontShow: boolean) => {
    if (dontShow) {
      localStorage.setItem('hideMyStoryWelcome', 'true');
    } else {
      localStorage.removeItem('hideMyStoryWelcome');
    }
  };

  const handleSaveChat = (refreshData: boolean = false) => {
    console.log("handleSaveChat called with refreshData:", refreshData);
    setRefreshDataOnSave(refreshData);
    setShowSaveChatDialog(true);
  };

  return {
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    setRefreshDataOnSave,
    handleDontShowWelcomeAgain,
    handleSaveChat
  };
};
