
import { useState, useCallback, useEffect } from 'react';
import { Conversation } from '@/services/conversation/types';
import { fetchConversations, fetchConversation } from '@/services/conversation/fetchConversations';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { ConversationSession } from '@/lib/types';

/**
 * Hook for managing prior story conversations
 */
export const usePriorStories = () => {
  const [priorConversations, setPriorConversations] = useState<Conversation[]>([]);
  const [loadingPriorConversations, setLoadingPriorConversations] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load prior conversations for the user
  const loadPriorConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingPriorConversations(true);
      console.log('PriorStories - Loading prior conversations for user:', user.id);
      
      const conversations = await fetchConversations(user.id);
      const storyConversations = conversations.filter(conv => conv.type === 'story');
      
      console.log(`PriorStories - Loaded ${storyConversations.length} prior story conversations`);
      if (storyConversations.length > 0) {
        console.log('PriorStories - First conversation sample:', {
          id: storyConversations[0].id,
          title: storyConversations[0].title,
          updated: storyConversations[0].updatedAt
        });
      }
      
      setPriorConversations(storyConversations);
    } catch (error) {
      console.error('PriorStories - Error fetching prior conversations:', error);
      toast({
        title: "Error loading conversations",
        description: "Could not load your previous conversations.",
        variant: "destructive"
      });
    } finally {
      setLoadingPriorConversations(false);
    }
  }, [user, toast]);

  // Load prior conversations when hook is initialized
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
      return null;
    }
    
    try {
      setLoadingPriorConversations(true);
      console.log(`PriorStories - Loading conversation with ID: ${conversationId}`);
      
      const conversation = await fetchConversation(conversationId, user.id);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      console.log('PriorStories - Loading conversation:', {
        id: conversation.id,
        title: conversation.title,
        messageCount: conversation.messages?.length || 0
      });
      
      // Verify we have messages before proceeding
      if (!conversation.messages || conversation.messages.length === 0) {
        console.error("PriorStories - Conversation has no messages");
        toast({
          title: "Error loading conversation",
          description: "This conversation appears to be empty.",
          variant: "destructive"
        });
        return null;
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
      
      console.log('PriorStories - Saving conversation to storage:', {
        id: conversationToSave.id,
        messageCount: conversationToSave.messages.length
      });
      saveCurrentConversationToStorage(conversationToSave);
      
      toast({
        title: "Conversation loaded",
        description: "Your conversation has been loaded successfully.",
      });
      
      return conversationId;
    } catch (error) {
      console.error('PriorStories - Error loading conversation:', error);
      toast({
        title: "Error loading conversation",
        description: "Could not load the selected conversation. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoadingPriorConversations(false);
    }
  };

  return {
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    user // Explicitly expose the user from Auth context
  };
};
