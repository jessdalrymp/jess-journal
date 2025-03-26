
import { useState } from 'react';
import * as conversationService from '../services/conversation';

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
      
      const result = await conversationService.createConversation(conversationParams);
      
      // Log success for debugging
      console.log(`Successfully created conversation of type ${type} with ID ${result.id}`);
      
      return result;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    setLoading(true);
    try {
      await conversationService.addMessageToConversation(
        conversationId, {
        role,
        content
      });
      return true; // Return true to indicate success
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
