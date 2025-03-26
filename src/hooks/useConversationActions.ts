
import { useState } from 'react';
import * as conversationService from '../services/conversation';
import { useToast } from '@/components/ui/use-toast';

export interface ConversationParams {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}

export function useConversationActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startConversation = async (userId: string, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<any> => {
    setLoading(true);
    try {
      // Verify that userId exists and is not empty
      if (!userId) {
        console.error("Cannot create conversation: User ID is missing");
        throw new Error("User authentication required. Please sign in again.");
      }

      // Create a conversation with a default title
      const title = `New ${type} - ${new Date().toLocaleDateString()}`;
      const conversationParams: ConversationParams = { userId, type, title };
      
      // Log for debugging
      console.log(`Attempting to create conversation for user ${userId} of type ${type}`);
      
      const result = await conversationService.createConversation(conversationParams);
      
      // Log success for debugging
      console.log(`Successfully created conversation of type ${type} with ID ${result.id}`);
      
      return result;
    } catch (error) {
      console.error('Error starting conversation:', error);
      
      // Add more specific error messaging based on the error
      if (error instanceof Error) {
        // Check for foreign key violation which could indicate profile isn't created yet
        if (error.message.includes('foreign key constraint')) {
          toast({
            title: "Profile not ready",
            description: "Your profile is being set up. Please try again in a moment.",
            variant: "destructive"
          });
          throw new Error("Your profile is still being set up. Please try again in a moment.");
        }
      }
      
      toast({
        title: "Error creating conversation",
        description: "Could not create a new conversation. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<boolean> => {
    setLoading(true);
    try {
      // Verify conversationId exists
      if (!conversationId) {
        console.error("Cannot add message: Conversation ID is missing");
        throw new Error("Conversation not found. Please start a new conversation.");
      }
      
      await conversationService.addMessageToConversation(
        conversationId, {
        role,
        content
      });
      return true; // Return true to indicate success
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      
      toast({
        title: "Error saving message",
        description: "Could not save your message. Please try again.",
        variant: "destructive"
      });
      
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
