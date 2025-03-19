
import { useState } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';
import { getInitialMessage } from '../chatUtils';
import { getCurrentConversationFromStorage, saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { fetchConversation } from '@/services/conversation';

export const useInitializeChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { startConversation } = useUserData();

  const initializeChat = async (conversationId?: string | null): Promise<ConversationSession | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Initializing ${type} chat${conversationId ? ` with conversation ID: ${conversationId}` : ''}`);
      
      // If we have a conversation ID, attempt to load it from database
      if (conversationId) {
        console.log(`Fetching conversation ${conversationId} from database`);
        const existingConversation = await fetchConversation(conversationId, user.id);
        
        if (existingConversation) {
          console.log(`Successfully loaded conversation ${conversationId} with ${existingConversation.messages.length} messages`);
          
          // Convert to session format
          const session: ConversationSession = {
            id: existingConversation.id,
            userId: existingConversation.userId,
            type: existingConversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
            title: existingConversation.title,
            messages: existingConversation.messages.map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: msg.createdAt
            })),
            createdAt: existingConversation.createdAt,
            updatedAt: existingConversation.updatedAt
          };
          
          // Save to local storage for offline access
          saveCurrentConversationToStorage(session);
          return session;
        } else {
          console.warn(`Conversation ${conversationId} not found in database`);
          // Fall through to create a new conversation if specified one not found
        }
      }
      
      // Check if there's an existing conversation in storage
      const storedConversation = getCurrentConversationFromStorage(type);
      if (storedConversation && !conversationId) {
        console.log(`Found existing ${type} conversation in storage:`, storedConversation.id);
        return storedConversation;
      }
      
      // Create a new conversation
      console.log(`Creating new ${type} conversation`);
      const newConversationData = await startConversation(type);
      
      if (!newConversationData) {
        throw new Error("Failed to create new conversation");
      }
      
      console.log(`Created new ${type} conversation:`, newConversationData.id);
      
      // Prepare initial message
      const initialSystemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: getInitialMessage(type),
        timestamp: new Date(),
      };
      
      // Create new session
      const newSession: ConversationSession = {
        id: newConversationData.id,
        userId: user.id,
        type,
        title: newConversationData.title || `New ${type} conversation`,
        messages: [initialSystemMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to local storage
      saveCurrentConversationToStorage(newSession);
      
      return newSession;
    } catch (err) {
      console.error(`Error initializing ${type} chat:`, err);
      setError(`Failed to initialize chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { initializeChat, loading, error };
};
