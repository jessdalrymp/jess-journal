
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
  try {
    const cachedConversation = getCurrentConversationFromStorage(type);
    
    // Validate the cached conversation belongs to the current user
    if (cachedConversation && cachedConversation.userId === userId) {
      console.log(`Retrieved valid cached conversation for ${type}`);
      return cachedConversation;
    }
    
    // If user ID doesn't match, the conversation is invalid, return null
    if (cachedConversation && cachedConversation.userId !== userId) {
      console.log(`Found cached conversation for ${type} but user ID doesn't match - clearing cache`);
      localStorage.removeItem(`current_${type}_conversation`);
    }
    
    return null;
  } catch (error) {
    console.error(`Error retrieving cached conversation for ${type}:`, error);
    return null;
  }
};

/**
 * Caches a conversation to localStorage
 */
export const cacheConversation = (conversation: ConversationSession): void => {
  try {
    if (!conversation || !conversation.type) {
      console.error("Cannot cache conversation: invalid conversation object", conversation);
      return;
    }
    
    saveCurrentConversationToStorage(conversation);
    console.log(`Cached ${conversation.type} conversation to localStorage`);
  } catch (error) {
    console.error("Error caching conversation:", error);
  }
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
      console.log(`Updated cached ${type} conversation`);
      break;
    }
  }
};
