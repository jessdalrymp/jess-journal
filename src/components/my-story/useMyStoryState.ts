
import { useEffect } from 'react';
import { useStoryModal, useStoryConversation, useStoryLoader, usePriorStories } from './hooks';

/**
 * Main hook for My Story feature state management
 * Combines smaller, more focused hooks for better organization
 */
export const useMyStoryState = () => {
  // Modal state management
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    handleDontShowWelcomeAgain,
    handleSaveChat
  } = useStoryModal();

  // Current conversation management
  const {
    existingConversationId,
    setExistingConversationId,
    isLoadingConversation, 
    setIsLoadingConversation,
    handleBack,
    handleStartFresh
  } = useStoryConversation();

  // Prior conversations management
  const {
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation: loadConversation
  } = usePriorStories();

  // Initial loading
  const {
    isLoading,
    userLoading
  } = useStoryLoader(setExistingConversationId, setShowWelcomeModal);

  // Handle loading conversation with proper state updates
  const handleLoadConversation = async (conversationId: string) => {
    if (existingConversationId === conversationId) {
      console.log('MyStoryState - Conversation already loaded');
      return;
    }
    
    setIsLoadingConversation(true);
    const loadedConversationId = await loadConversation(conversationId);
    
    if (loadedConversationId) {
      setExistingConversationId(loadedConversationId);
      // Force reload to ensure everything is fresh
      window.location.reload();
    }
    
    setIsLoadingConversation(false);
  };

  // Refresh prior conversations when loading is complete
  useEffect(() => {
    if (!isLoading && !userLoading && !isLoadingConversation) {
      console.log("MyStory: Loading complete, priorConversations:", priorConversations.length);
    }
  }, [isLoading, userLoading, isLoadingConversation, priorConversations.length]);

  return {
    // Modal state
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    refreshDataOnSave,
    
    // Loading state
    isLoading,
    userLoading,
    isLoadingConversation,
    
    // Conversation data
    existingConversationId,
    priorConversations,
    loadingPriorConversations,
    
    // User data (from context)
    user: usePriorStories().user,
    
    // Actions
    handleBack,
    handleSaveChat,
    handleStartFresh,
    handleLoadConversation,
    handleDontShowWelcomeAgain
  };
};
