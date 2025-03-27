
import { useCallback } from 'react';
import { ConversationSession } from '@/lib/types';
import { getConversationsFromStorage, saveConversationsToStorage, saveCurrentConversationToStorage } from '@/lib/storageUtils';

export const useConversationCache = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  /**
   * Get a cached conversation for a specific user or conversation ID
   */
  const getCachedConversation = useCallback((userIdOrConversationId: string) => {
    try {
      // Try to get conversations from storage
      const conversations = getConversationsFromStorage();
      
      // First try to find by conversation ID
      let conversation = conversations.find(c => c.id === userIdOrConversationId);
      
      // If not found, try to find the most recent conversation of the specified type for this user
      if (!conversation) {
        const userConversations = conversations.filter(
          c => c.type === type && c.userId === userIdOrConversationId
        );
        
        if (userConversations.length > 0) {
          // Sort by most recent and return the first one
          conversation = userConversations.sort((a, b) => {
            // Use the updatedAt property if available
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })[0];
          
          console.log(`Found cached ${type} conversation for user ${userIdOrConversationId}:`, conversation.id);
        }
      } else {
        console.log(`Found cached conversation by ID: ${userIdOrConversationId}`);
      }
      
      return conversation || null;
    } catch (error) {
      console.error('Error getting cached conversation:', error);
      return null;
    }
  }, [type]);
  
  /**
   * Cache a conversation to both storage and memory
   */
  const cacheConversation = useCallback((conversation: ConversationSession) => {
    try {
      console.log(`Caching conversation ${conversation.id}`);
      
      // Save to application storage
      saveCurrentConversationToStorage(conversation);
      
      // Also update the conversations array
      const conversations = getConversationsFromStorage();
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        // Update existing conversation
        conversations[existingIndex] = conversation;
      } else {
        // Add new conversation
        conversations.push(conversation);
      }
      
      saveConversationsToStorage(conversations);
    } catch (error) {
      console.error('Error caching conversation:', error);
    }
  }, []);
  
  return {
    getCachedConversation,
    cacheConversation
  };
};
