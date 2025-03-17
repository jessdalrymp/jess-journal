
import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '../lib/types';
import { getConversationsFromStorage, saveConversationsToStorage } from '../lib/storageUtils';

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false);

  // Load conversations when userId changes or component mounts
  useEffect(() => {
    if (!userId || isLoaded || loadingRef.current) return;
    
    loadingRef.current = true;
    try {
      const storedConversations = getConversationsFromStorage();
      setConversations(storedConversations);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [userId, isLoaded]);

  const loadConversations = () => {
    if (!userId) {
      setConversations([]);
      return;
    }

    if (loadingRef.current) {
      console.log('Already loading conversations, skipping duplicate request');
      return;
    }

    try {
      loadingRef.current = true;
      const storedConversations = getConversationsFromStorage();
      setConversations(storedConversations);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      loadingRef.current = false;
    }
  };

  const getConversation = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    if (!userId) return null;
    
    try {
      // Get conversations from storage
      const storedConversations = getConversationsFromStorage();
      
      // Find the most recent conversation of the requested type for this user
      const typeConversations = storedConversations.filter(
        c => c.type === type && c.userId === userId
      );
      
      if (typeConversations.length === 0) {
        return null;
      }
      
      // Return the most recent conversation
      return typeConversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
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
    isLoaded,
    loadConversations,
    getConversation,
    startConversation,
    addMessageToConversation
  };
};
