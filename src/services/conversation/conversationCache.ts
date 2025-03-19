
import { Conversation } from './types';

// Local cache for conversation data
const conversationCache = new Map<string, Conversation>();

// Get cached conversation
export const getCachedConversation = (conversationId: string): Conversation | undefined => {
  return conversationCache.get(conversationId);
};

// Store conversation in cache
export const cacheConversation = (conversation: Conversation) => {
  conversationCache.set(conversation.id, conversation);
};

// Clear cache for a conversation
export const clearConversationCache = (conversationId: string) => {
  conversationCache.delete(conversationId);
};

// Clear all conversation cache
export const clearAllConversationCache = () => {
  conversationCache.clear();
};

// Update specific fields in cached conversation
export const updateCachedConversation = (conversationId: string, updates: Partial<Conversation>) => {
  const conversation = getCachedConversation(conversationId);
  if (conversation) {
    cacheConversation({ ...conversation, ...updates });
  }
};
