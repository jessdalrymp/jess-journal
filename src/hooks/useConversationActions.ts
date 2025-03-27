
import { useState } from 'react';
import * as conversationService from '../services/conversation';

export interface ConversationParams {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}

export function useConversationActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = async (userId: string, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<any> => {
    if (!userId) {
      const errorMessage = "Cannot start conversation: User ID is required";
      console.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create a conversation with a default title
      const title = `New ${type} - ${new Date().toLocaleDateString()}`;
      const conversationParams: ConversationParams = { userId, type, title };
      
      console.log(`Starting new ${type} conversation for user ${userId}`);
      const result = await conversationService.createConversation(conversationParams);
      
      if (!result) {
        const errorMessage = `Failed to create ${type} conversation`;
        console.error(errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!result.id) {
        const errorMessage = `Created ${type} conversation but no ID was returned`;
        console.error(errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log(`Successfully created ${type} conversation with ID: ${result.id}`);
      return result;
    } catch (error) {
      const errorMessage = `Error starting conversation: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage, error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    if (!conversationId) {
      const errorMessage = "Cannot add message: Conversation ID is required";
      console.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Adding ${role} message to conversation ${conversationId}`);
      const result = await conversationService.addMessageToConversation(
        conversationId, {
        role,
        content
      });
      
      if (!result) {
        const errorMessage = `Failed to add message to conversation ${conversationId}`;
        console.error(errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log(`Successfully added message to conversation ${conversationId}`);
      return true;
    } catch (error) {
      const errorMessage = `Error adding message to conversation: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage, error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    startConversation,
    addMessageToConversation,
  };
}
