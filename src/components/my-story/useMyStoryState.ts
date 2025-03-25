
import { useAuth } from '@/context/AuthContext';
import { useConversationState } from './hooks/useConversationState';
import { useWelcomeModalState } from './hooks/useWelcomeModalState';
import { usePriorConversations } from './hooks/usePriorConversations';
import { useNavigationActions } from './hooks/useNavigationActions';
import { useUserData } from '@/context/UserDataContext';

export const useMyStoryState = () => {
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();
  
  // Use the smaller, focused hooks
  const {
    isLoading,
    existingConversationId,
    setExistingConversationId,
    conversationError,
    setConversationError,
    isLoadingConversation,
    setIsLoadingConversation,
    clearConversationError,
    handleStartFresh
  } = useConversationState();
  
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    handleDontShowWelcomeAgain
  } = useWelcomeModalState();
  
  const {
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation
  } = usePriorConversations(
    setIsLoadingConversation,
    setExistingConversationId,
    setConversationError
  );
  
  const {
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    handleBack: baseHandleBack,
    handleSaveChat
  } = useNavigationActions();
  
  // Extend the handleBack function to include journal refresh
  const handleBack = async () => {
    if (user) {
      await fetchJournalEntries().catch(error => {
        console.error('MyStoryState - Error refreshing journal entries:', error);
      });
    }
    baseHandleBack();
  };
  
  // Extended handleStartFresh to include journal refresh
  const extendedHandleStartFresh = async () => {
    try {
      await fetchJournalEntries();
      handleStartFresh();
    } catch (error) {
      console.error('MyStoryState - Error refreshing journal entries:', error);
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
    handleStartFresh: extendedHandleStartFresh,
    refreshDataOnSave,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation,
    handleDontShowWelcomeAgain,
    conversationError,
    clearConversationError
  };
};
