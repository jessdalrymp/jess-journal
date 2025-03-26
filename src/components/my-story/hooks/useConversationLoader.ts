
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getCurrentConversationFromStorage, 
  clearCurrentConversationFromStorage,
  saveCurrentConversationToStorage
} from '@/lib/storageUtils';
import { useToast } from '@/hooks/use-toast';
import { fetchConversation } from '@/services/conversation/fetchConversations';
import { ConversationSession } from '@/lib/types';

export const useConversationLoader = () => {
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  const { user } = useAuth();
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
        }
      } catch (error) {
        console.error('Error retrieving conversation from storage:', error);
      }
      
      setIsLoading(false);
    }
  }, [user]);
  
  const handleStartFresh = async () => {
    if (existingConversationId) {
      clearCurrentConversationFromStorage('story');
      
      toast({
        title: "New Story Started",
        description: "Your previous story was saved and a new conversation has been started.",
      });
      
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
      setIsLoadingConversation(true);
      console.log(`Loading conversation with ID: ${conversationId}`);
      
      const conversation = await fetchConversation(conversationId, user.id);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      console.log('Loading conversation:', conversation);
      
      // Verify we have messages before proceeding
      if (!conversation.messages || conversation.messages.length === 0) {
        console.error("Conversation has no messages");
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
      
      console.log('Saving conversation to storage:', conversationToSave);
      saveCurrentConversationToStorage(conversationToSave);
      
      setExistingConversationId(conversationId);
      
      toast({
        title: "Conversation loaded",
        description: "Your conversation has been loaded successfully.",
      });
      
      // Force reload to ensure everything is fresh
      window.location.reload();
    } catch (error) {
      console.error('Error loading conversation:', error);
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
    existingConversationId,
    isLoading,
    isLoadingConversation,
    handleStartFresh,
    handleLoadConversation
  };
};
