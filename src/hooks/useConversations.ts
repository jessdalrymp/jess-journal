
import { useState } from 'react';
import { ConversationSession } from '../lib/types';
import { getConversationsFromStorage, saveConversationsToStorage } from '../lib/storageUtils';

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);

  const loadConversations = () => {
    if (!userId) {
      setConversations([]);
      return;
    }

    try {
      const storedConversations = getConversationsFromStorage();
      setConversations(storedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal', title?: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    const newConversation: ConversationSession = {
      id: Date.now().toString(),
      userId,
      type,
      title: title || `New ${type} - ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedConversations = [...conversations, newConversation];
    saveConversationsToStorage(updatedConversations);
    setConversations(updatedConversations);
    
    return newConversation;
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    if (!userId) throw new Error('User not authenticated');
    
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) throw new Error('Conversation not found');
    
    const updatedConversation = {
      ...conversations[conversationIndex],
      messages: [
        ...conversations[conversationIndex].messages,
        {
          id: Date.now().toString(),
          role,
          content,
          timestamp: new Date(),
        },
      ],
      updatedAt: new Date(),
    };
    
    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex] = updatedConversation;
    
    saveConversationsToStorage(updatedConversations);
    setConversations(updatedConversations);
  };

  return {
    conversations,
    loadConversations,
    startConversation,
    addMessageToConversation
  };
};
