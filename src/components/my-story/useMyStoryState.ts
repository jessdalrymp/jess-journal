import { useState, useEffect } from 'react';
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
  
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const { fetchJournalEntries } = useUserData();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        
        if (existingConversation) {
          console.log('Found existing story conversation:', existingConversation.id);
          setExistingConversationId(existingConversation.id);
        } else {
          console.log('No existing story conversation found');
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadPriorConversations = async () => {
      if (!user) return;
      
      try {
        setLoadingPriorConversations(true);
        const conversations = await fetchConversations(user.id);
        
        const storyConversations = conversations.filter(conv => conv.type === 'story');
        
        console.log(`Loaded ${storyConversations.length} prior story conversations:`, storyConversations);
        setPriorConversations(storyConversations);
      } catch (error) {
        console.error('Error fetching prior conversations:', error);
        toast({
          title: "Error loading conversations",
          description: "Could not load your previous conversations.",
          variant: "destructive"
        });
      } finally {
        setLoadingPriorConversations(false);
      }
    };
    
    loadPriorConversations();
  }, [user, toast]);

  const handleBack = async () => {
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
      clearCurrentConversationFromStorage('story');
      
      try {
        await fetchJournalEntries();
        toast({
          title: "New Story Started",
          description: "Your previous story was saved and a new conversation has been started.",
        });
      } catch (error) {
        console.error('Error refreshing journal entries:', error);
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
      console.log('Conversation already loaded');
      return;
    }
    
    try {
      const conversation = await fetchConversation(conversationId, user.id);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      console.log('Loading conversation:', conversation);
      
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
      
      saveCurrentConversationToStorage(conversationToSave);
      
      setExistingConversationId(conversationId);
      
      window.location.reload();
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error loading conversation",
        description: "Could not load the selected conversation. Please try again.",
        variant: "destructive"
      });
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
    handleLoadConversation
  };
};
