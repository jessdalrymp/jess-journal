
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { useWelcomeModal } from './hooks/useWelcomeModal';
import { useSaveChatDialog } from './hooks/useSaveChatDialog';
import { useConversationLoader } from './hooks/useConversationLoader';
import { usePriorConversations } from './hooks/usePriorConversations';
import { useNavigationHandlers } from './hooks/useNavigationHandlers';
import { useEffect } from 'react';

export const useMyStoryState = () => {
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();
  
  const { showWelcomeModal, setShowWelcomeModal, initializeWelcomeModal } = useWelcomeModal();
  const { showSaveChatDialog, setShowSaveChatDialog, refreshDataOnSave, handleSaveChat } = useSaveChatDialog();
  const { existingConversationId, isLoading, isLoadingConversation, handleStartFresh, handleLoadConversation } = useConversationLoader();
  const { priorConversations, loadingPriorConversations } = usePriorConversations();
  const { handleBack } = useNavigationHandlers();
  
  // Initialize welcome modal based on existence of conversation
  useEffect(() => {
    if (!isLoading && user) {
      initializeWelcomeModal(!existingConversationId);
    }
  }, [isLoading, user, existingConversationId]);
  
  // Utility function to handle starting fresh that integrates with journal entries
  const handleStartFreshWithRefresh = async () => {
    try {
      await fetchJournalEntries();
      handleStartFresh();
    } catch (error) {
      console.error('Error refreshing journal entries:', error);
      handleStartFresh();
    }
  };

  return {
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    isLoading,
    userLoading,
    existingConversationId,
    user,
    handleBack,
    handleSaveChat,
    handleStartFresh: handleStartFreshWithRefresh,
    refreshDataOnSave,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation
  };
};
