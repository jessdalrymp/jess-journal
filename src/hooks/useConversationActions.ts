
import { useState } from 'react';
import { ConversationSession } from '../lib/types';
import * as conversationApi from '../services/conversation/conversationApi';

export interface ConversationParams {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}

export function useConversationActions() {
  const [loading, setLoading] = useState(false);

  const startConversation = async (userId: string, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<any> => {
    setLoading(true);
    try {
      // Create a conversation with a default title
      const title = `New ${type} - ${new Date().toLocaleDateString()}`;
      const conversationParams: ConversationParams = { userId, type, title };
      
      const result = await conversationApi.createConversation(conversationParams);
      return result;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    setLoading(true);
    try {
      await conversationApi.addMessageToConversation(conversationId, {
        role,
        content
      });
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
