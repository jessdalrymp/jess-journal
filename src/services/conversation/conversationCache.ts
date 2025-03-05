
import { ConversationSession } from '../../lib/types';
import { 
  getCurrentConversationFromStorage, 
  saveCurrentConversationToStorage 
} from '../../lib/storageUtils';

/**
 * Retrieves a cached conversation for a specific user
 */
export const getCachedConversation = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  userId: string
): ConversationSession | null => {
  const cachedConversation = getCurrentConversationFromStorage(type);
  if (cachedConversation && cachedConversation.userId === userId) {
    return cachedConversation;
  }
  return null;
};

/**
 * Caches a conversation to localStorage
 */
export const cacheConversation = (conversation: ConversationSession): void => {
  saveCurrentConversationToStorage(conversation);
};

/**
 * Updates a cached conversation with new details
 */
export const updateCachedConversation = (
  conversationId: string,
  updates: Partial<ConversationSession>
): void => {
  // Find which type the conversation is
  const types: Array<'story' | 'sideQuest' | 'action' | 'journal'> = ['story', 'sideQuest', 'action', 'journal'];
  
  for (const type of types) {
    const cachedConversation = getCurrentConversationFromStorage(type);
    if (cachedConversation && cachedConversation.id === conversationId) {
      const updatedConversation = {
        ...cachedConversation,
        ...updates
      };
      saveCurrentConversationToStorage(updatedConversation);
      break;
    }
  }
};
