import { useState, useCallback } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useConversationActions } from '@/hooks/useConversationActions';
import { getConversationFromStorage, saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { getInitialMessage } from '../chatUtils';
import { fetchConversation } from '@/services/conversation/fetchConversations';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { startConversation } = useConversationActions();

  const initializeChat = useCallback(async (conversationId?: string | null): Promise<ConversationSession | null> => {
    if (!user || !user.id) {
      console.error('User not authenticated');
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Initializing chat for type: ${type}${conversationId ? ` with existing conversation id: ${conversationId}` : ''}`);
      console.log(`User authentication state: ${user ? `Authenticated as ${user.id}` : 'Not authenticated'}`);
      
      // If a specific conversation ID is passed, load that conversation
      if (conversationId) {
        console.log(`Attempting to load existing conversation: ${conversationId}`);
        
        try {
          console.log(`Attempting to load specific conversation ID: ${conversationId} for user: ${user.id}`);
          const conversation = await fetchConversation(conversationId, user.id);
          
          if (!conversation) {
            throw new Error(`Conversation not found: ${conversationId}`);
          }
          
          // Check if the messages were loaded
          if (!conversation.messages || conversation.messages.length === 0) {
            console.error(`No messages found for conversation: ${conversationId}`);
          }
          
          console.log(`Successfully loaded existing conversation with ${conversation.messages.length} messages`);
          
          const session: ConversationSession = {
            id: conversation.id,
            userId: user.id,
            type: conversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
            title: conversation.title || `${type} Conversation`,
            messages: conversation.messages.map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: msg.createdAt
            })) as ChatMessage[],
            summary: conversation.summary,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt
          };
          
          // Save the session to local storage
          saveCurrentConversationToStorage(session);
          
          return session;
        } catch (error) {
          console.error(`Error loading conversation ${conversationId}:`, error);
          throw new Error(`Failed to load conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Otherwise, look for an existing conversation in storage or create a new one
      const existingConversation = getConversationFromStorage(type);
      
      if (existingConversation && existingConversation.userId === user.id) {
        console.log(`Found existing conversation in storage for ${type}`);
        return existingConversation;
      }
      
      // Create a new conversation if none exists
      console.log(`Creating new ${type} conversation`);
      const initialMessage = getInitialMessage(type);
      
      try {
        const conversation = await startConversation(user.id, type);
        
        if (!conversation) {
          throw new Error('Failed to create conversation');
        }
        
        // Add initial system message
        const initialChatMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date()
        };
        
        // Create the session with the initial message
        const session: ConversationSession = {
          id: conversation.id,
          userId: user.id,
          type: type,
          title: `New ${type}`,
          messages: [initialChatMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Save to storage
        saveCurrentConversationToStorage(session);
        
        return session;
      } catch (error) {
        console.error('Error starting new conversation:', error);
        throw new Error(`Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, type, startConversation]);

  return {
    initializeChat,
    loading,
    error
  };
};
