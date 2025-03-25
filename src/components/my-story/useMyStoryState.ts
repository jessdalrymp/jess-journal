
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { getCurrentConversationFromStorage, clearCurrentConversationFromStorage, saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { fetchConversations, fetchConversation } from '@/services/conversation/fetchConversations';
import { Conversation } from '@/services/conversation/types';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession } from '@/lib/types';

export const useMyStoryState = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [refreshDataOnSave, setRefreshDataOnSave] = useState(false);
  const [priorConversations, setPriorConversations] = useState<Conversation[]>([]);
  const [loadingPriorConversations, setLoadingPriorConversations] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();

  // Load existing conversation from storage if available
  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('MyStoryState - Found existing story conversation:', existingConversation.id);
          setExistingConversationId(existingConversation.id);
        } else {
          console.log('MyStoryState - No existing story conversation found');
          // Check user preference for welcome modal
          const hideWelcomeModal = localStorage.getItem('hideMyStoryWelcome') === 'true';
          setShowWelcomeModal(!hideWelcomeModal);
        }
      } catch (error) {
        console.error('MyStoryState - Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
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

  // Load prior conversations for the user
  const loadPriorConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingPriorConversations(true);
      console.log('MyStoryState - Loading prior conversations for user:', user.id);
      
      const conversations = await fetchConversations(user.id);
      const storyConversations = conversations.filter(conv => conv.type === 'story');
      
      console.log(`MyStoryState - Loaded ${storyConversations.length} prior story conversations`);
      if (storyConversations.length > 0) {
        console.log('MyStoryState - First conversation sample:', {
          id: storyConversations[0].id,
          title: storyConversations[0].title,
          updated: storyConversations[0].updatedAt
        });
      }
      
      setPriorConversations(storyConversations);
    } catch (error) {
      console.error('MyStoryState - Error fetching prior conversations:', error);
      toast({
        title: "Error loading conversations",
        description: "Could not load your previous conversations.",
        variant: "destructive"
      });
    } finally {
      setLoadingPriorConversations(false);
    }
  }, [user, toast]);

  // Load prior conversations when component mounts or user changes
  useEffect(() => {
    loadPriorConversations();
  }, [loadPriorConversations]);

  const handleBack = async () => {
    if (user) {
      console.log('MyStoryState - Refreshing journal entries before navigating back to dashboard');
      try {
        await fetchJournalEntries();
      } catch (error) {
        console.error('MyStoryState - Error refreshing journal entries:', error);
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
      console.log('MyStoryState - Starting fresh conversation');
      clearCurrentConversationFromStorage('story');
      
      try {
        await fetchJournalEntries();
        toast({
          title: "New Story Started",
          description: "Your previous story was saved and a new conversation has been started.",
        });
      } catch (error) {
        console.error('MyStoryState - Error refreshing journal entries:', error);
      }
      
      setExistingConversationId(null);
      window.location.reload();
    }
  };

  const handleLoadConversation = async (conversationId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view this conversation",
        variant: "destructive"
      });
      return;
    }
    
    if (existingConversationId === conversationId) {
      console.log('MyStoryState - Conversation already loaded');
      return;
    }
    
    try {
      setIsLoadingConversation(true);
      console.log(`MyStoryState - Loading conversation with ID: ${conversationId}`);
      
      const conversation = await fetchConversation(conversationId, user.id);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      console.log('MyStoryState - Loading conversation:', {
        id: conversation.id,
        title: conversation.title,
        messageCount: conversation.messages?.length || 0
      });
      
      // Verify we have messages before proceeding
      if (!conversation.messages || conversation.messages.length === 0) {
        console.error("MyStoryState - Conversation has no messages");
        toast({
          title: "Error loading conversation",
          description: "This conversation appears to be empty.",
          variant: "destructive"
        });
        setIsLoadingConversation(false);
        return;
      }
      
      // Create the conversation object to save
      const conversationToSave: ConversationSession = {
        id: conversation.id,
        userId: conversation.userId,
        type: conversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: conversation.title || 'My Story',
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.createdAt
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
      
      console.log('MyStoryState - Saving conversation to storage:', {
        id: conversationToSave.id,
        messageCount: conversationToSave.messages.length
      });
      saveCurrentConversationToStorage(conversationToSave);
      
      setExistingConversationId(conversationId);
      
      toast({
        title: "Conversation loaded",
        description: "Your conversation has been loaded successfully.",
      });
      
      // Force reload to ensure everything is fresh
      window.location.reload();
    } catch (error) {
      console.error('MyStoryState - Error loading conversation:', error);
      toast({
        title: "Error loading conversation",
        description: "Could not load the selected conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingConversation(false);
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
    refreshDataOnSave,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation,
    handleDontShowWelcomeAgain
  };
};
