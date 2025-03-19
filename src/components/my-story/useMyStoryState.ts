import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';
import { fetchConversation } from '@/services/conversation';

export const useMyStoryState = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();

  // Check for existing story conversation
  useEffect(() => {
    if (user) {
      try {
        setIsLoading(true);
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('Found existing story conversation in storage:', existingConversation.id);
          
          // Verify the conversation exists in the database
          fetchConversation(existingConversation.id, user.id)
            .then(conversation => {
              if (conversation) {
                console.log('Verified conversation in database:', conversation.id);
                setExistingConversationId(conversation.id);
              } else {
                console.log('Conversation not found in database, clearing from storage');
                // We don't automatically clear the storage anymore to prevent session loss
                setShowWelcomeModal(true);
              }
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error verifying conversation:', error);
              setIsLoading(false);
              setShowWelcomeModal(true);
            });
        } else {
          console.log('No existing story conversation found in storage');
          setIsLoading(false);
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error retrieving conversation from storage:', error);
        setIsLoading(false);
        setShowWelcomeModal(true);
      }
    }
  }, [user]);

  const handleBack = async () => {
    // Ensure journal entries are refreshed when navigating back to dashboard
    if (user) {
      console.log('Refreshing journal entries before navigating back to dashboard');
      try {
        await fetchJournalEntries();
      } catch (error) {
        console.error('Error refreshing journal entries:', error);
      }
    }
    navigate('/dashboard');
  };

  const handleSaveChat = (refreshData: boolean = false) => {
    setRefreshDataOnSave(refreshData);
    setShowSaveChatDialog(true);
  };

  const handleStartFresh = async () => {
    if (existingConversationId) {
      // Clear out the current conversation from storage
      // We keep this functionality here as it's a deliberate user action
      import('@/lib/storageUtils').then(({ clearCurrentConversationFromStorage }) => {
        clearCurrentConversationFromStorage('story');
      });
      
      // Refresh journal entries to capture any new entries
      try {
        await fetchJournalEntries();
      } catch (error) {
        console.error('Error refreshing journal entries:', error);
      }
      
      // Reset conversation ID and reload page
      setExistingConversationId(null);
      window.location.reload();
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
    handleStartFresh,
    refreshDataOnSave
  };
};
