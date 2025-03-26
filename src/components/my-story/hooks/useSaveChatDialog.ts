
import { useState } from 'react';

export const useSaveChatDialog = () => {
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);
  
  const handleSaveChat = (refreshData: boolean = false) => {
    setRefreshDataOnSave(refreshData);
    setShowSaveChatDialog(true);
  };
  
  return {
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    handleSaveChat
  };
};
