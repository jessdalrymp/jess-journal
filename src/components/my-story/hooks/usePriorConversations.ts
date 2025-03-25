
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchConversations, fetchConversation } from '@/services/conversation/fetchConversations';
import { Conversation } from '@/services/conversation/types';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession } from '@/lib/types';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';

export const usePriorConversations = (
  setIsLoadingConversation: (isLoading: boolean) => void,
  setExistingConversationId: (id: string | null) => void,
  setConversationError: (error: string | null) => void
) => {
  const [priorConversations, setPriorConversations] = useState<Conversation[]>([]);
  const [loadingPriorConversations, setLoadingPriorConversations] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load prior conversations for the user
  const loadPriorConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingPriorConversations(true);
      console.log('PriorConversations - Loading prior conversations for user:', user.id);
      
      const conversations = await fetchConversations(user.id);
      const storyConversations = conversations.filter(conv => conv.type === 'story');
      
      console.log(`PriorConversations - Loaded ${storyConversations.length} prior story conversations`);
      if (storyConversations.length > 0) {
        console.log('PriorConversations - First conversation sample:', {
          id: storyConversations[0].id,
          title: storyConversations[0].title,
          updated: storyConversations[0].updatedAt
        });
      }
      
      setPriorConversations(storyConversations);
    } catch (error) {
      console.error('PriorConversations - Error fetching prior conversations:', error);
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

  const handleLoadConversation = async (conversationId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view this conversation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoadingConversation(true);
      setConversationError(null);
      console.log(`PriorConversations - Loading conversation with ID: ${conversationId}`);
      
      const conversation = await fetchConversation(conversationId, user.id);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      console.log('PriorConversations - Loading conversation:', {
        id: conversation.id,
        title: conversation.title,
        messageCount: conversation.messages?.length || 0
      });
      
      // Verify we have messages before proceeding
      if (!conversation.messages || conversation.messages.length === 0) {
        console.error("PriorConversations - Conversation has no messages");
        setConversationError("This conversation appears to be empty.");
        toast({
          title: "Error loading conversation",
          description: "This conversation appears to be empty.",
          variant: "destructive"
        });
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
      
      console.log('PriorConversations - Saving conversation to storage:', {
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
      console.error('PriorConversations - Error loading conversation:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Could not load the selected conversation.";
      
      setConversationError(errorMessage);
      
      toast({
        title: "Error loading conversation",
        description: "Could not load the selected conversation. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoadingConversation(false);
    }
  };

  return {
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation
  };
};
