
import { ConversationSession } from '../../lib/types';
import { 
  getCurrentConversationFromStorage, 
  saveCurrentConversationToStorage 
} from '../../lib/storageUtils';

// Cache object to store conversations in memory 
const conversationMemoryCache: Record<string, {
  data: ConversationSession;
  timestamp: number;
}> = {};

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

/**
 * Retrieves a cached conversation for a specific user
 * Uses a two-level cache strategy: memory first, then localStorage
 */
export const getCachedConversation = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  userId: string
): ConversationSession | null => {
  try {
    const cacheKey = `${type}_${userId}`;
    
    // First check memory cache for faster access
    const memoryCached = conversationMemoryCache[cacheKey];
    if (memoryCached && (Date.now() - memoryCached.timestamp) < CACHE_EXPIRATION) {
      console.log(`Retrieved ${type} conversation from memory cache`);
      return memoryCached.data;
    }
    
    // If not in memory or expired, check localStorage
    const cachedConversation = getCurrentConversationFromStorage(type);
    
    // Check if we have a valid conversation object
    if (!cachedConversation) {
      console.log(`No cached conversation found for ${type}`);
      return null;
    }
    
    // Validate the cached conversation belongs to the current user
    if (cachedConversation.userId === userId) {
      // Update memory cache for faster future access
      conversationMemoryCache[cacheKey] = {
        data: cachedConversation,
        timestamp: Date.now()
      };
      
      console.log(`Retrieved valid cached conversation for ${type}`);
      return cachedConversation;
    }
    
    // If user ID doesn't match, the conversation is invalid, remove it
    console.log(`Found cached conversation for ${type} but user ID doesn't match - clearing cache`);
    localStorage.removeItem(`current_${type}_conversation`);
    return null;
  } catch (error) {
    console.error(`Error retrieving cached conversation for ${type}:`, error);
    // If there's an error, clear the potentially corrupted cache
    try {
      const cacheKey = `${type}_${userId}`;
      delete conversationMemoryCache[cacheKey];
      localStorage.removeItem(`current_${type}_conversation`);
    } catch (e) {
      console.error('Error clearing corrupted cache:', e);
    }
    return null;
  }
};

/**
 * Caches a conversation to both memory and localStorage
 */
export const cacheConversation = (conversation: ConversationSession): void => {
  try {
    if (!conversation || !conversation.type) {
      console.error("Cannot cache conversation: invalid conversation object", conversation);
      return;
    }
    
    // Cache to localStorage
    saveCurrentConversationToStorage(conversation);
    
    // Cache to memory for faster access
    const cacheKey = `${conversation.type}_${conversation.userId}`;
    conversationMemoryCache[cacheKey] = {
      data: conversation,
      timestamp: Date.now()
    };
    
    console.log(`Cached ${conversation.type} conversation to memory and localStorage`);
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
      
      // Update localStorage
      saveCurrentConversationToStorage(updatedConversation);
      
      // Update memory cache
      if (cachedConversation.userId) {
        const cacheKey = `${type}_${cachedConversation.userId}`;
        conversationMemoryCache[cacheKey] = {
          data: updatedConversation,
          timestamp: Date.now()
        };
      }
      
      console.log(`Updated cached ${type} conversation`);
      break;
    }
  }
};

/**
 * Clears all cached conversations
 */
export const clearAllCachedConversations = (): void => {
  try {
    const types: Array<'story' | 'sideQuest' | 'action' | 'journal'> = ['story', 'sideQuest', 'action', 'journal'];
    
    // Clear localStorage caches
    for (const type of types) {
      localStorage.removeItem(`current_${type}_conversation`);
    }
    
    // Clear memory cache
    Object.keys(conversationMemoryCache).forEach(key => {
      delete conversationMemoryCache[key];
    });
    
    console.log('Cleared all cached conversations');
  } catch (error) {
    console.error('Error clearing cached conversations:', error);
  }
};
