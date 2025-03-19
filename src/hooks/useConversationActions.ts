
import { useState } from 'react';
import { ConversationSession } from '../lib/types';
import * as conversationService from '../services/conversation';

export function useConversationActions() {
  const [loading, setLoading] = useState(false);

  const startConversation = async (userId: string, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
    setLoading(true);
    try {
      return await conversationService.startConversation(userId, type);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant', userId?: string): Promise<void> => {
    setLoading(true);
    try {
      await conversationService.addMessageToConversation(conversationId, content, role, userId);
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    startConversation,
    addMessageToConversation,
  };
}
