
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { getCurrentConversationFromStorage, clearCurrentConversationFromStorage } from '@/lib/storageUtils';
import { fetchConversations } from '@/services/conversation/fetchConversations';
import { Conversation } from '@/services/conversation/types';

export const useMyStoryState = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);
  const [priorConversations, setPriorConversations] = useState<Conversation[]>([]);
  const [loadingPriorConversations, setLoadingPriorConversations] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();

  // Check for existing story conversation
  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('Found existing story conversation:', existingConversation.id);
          setExistingConversationId(existingConversation.id);
        } else {
          console.log('No existing story conversation found');
          // Show welcome modal if no existing conversation
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  // Fetch prior conversations when component loads
  useEffect(() => {
    const loadPriorConversations = async () => {
      if (!user) return;
      
      try {
        setLoadingPriorConversations(true);
        const conversations = await fetchConversations(user.id);
        // Filter only story type conversations
        const storyConversations = conversations.filter(conv => conv.type === 'story');
        setPriorConversations(storyConversations);
        console.log(`Loaded ${storyConversations.length} prior story conversations`);
      } catch (error) {
        console.error('Error fetching prior conversations:', error);
      } finally {
        setLoadingPriorConversations(false);
      }
    };
    
    loadPriorConversations();
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
      clearCurrentConversationFromStorage('story');
      
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

  const handleLoadConversation = (conversationId: string) => {
    if (existingConversationId === conversationId) {
      console.log('Conversation already loaded');
      return;
    }
    
    // Set the conversation ID and reload the page to load it
    setExistingConversationId(conversationId);
    window.location.reload();
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
    refreshDataOnSave,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation
  };
};
