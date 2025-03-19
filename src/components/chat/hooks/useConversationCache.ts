
import { useCallback } from 'react';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';
import { ConversationSession } from '@/lib/types';

/**
 * Hook to handle conversation caching logic
 */
export const useConversationCache = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const getCachedConversation = useCallback((userId: string): ConversationSession | null => {
    const cachedConversation = getCurrentConversationFromStorage(type);
    
    if (cachedConversation && cachedConversation.userId === userId) {
      console.log(`Using existing ${type} conversation from cache`);
      return cachedConversation;
    }
    
    return null;
  }, [type]);

  return {
    getCachedConversation
  };
};
