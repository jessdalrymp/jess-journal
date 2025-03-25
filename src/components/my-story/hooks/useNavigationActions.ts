
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';

export const useNavigationActions = () => {
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);
  
  const navigate = useNavigate();
  const { fetchJournalEntries } = useUserData();

  const handleBack = async () => {
    try {
      console.log('NavigationActions - Refreshing journal entries before navigating back to dashboard');
      await fetchJournalEntries();
    } catch (error) {
      console.error('NavigationActions - Error refreshing journal entries:', error);
    }
    navigate('/dashboard');
  };

  const handleSaveChat = (refreshData: boolean = false) => {
    setRefreshDataOnSave(refreshData);
    setShowSaveChatDialog(true);
  };

  return {
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    handleBack,
    handleSaveChat
  };
};
