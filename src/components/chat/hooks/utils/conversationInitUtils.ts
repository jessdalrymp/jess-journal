
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { ConversationSession } from '@/lib/types';
import { getInitialMessage } from '../../chatUtils';
import { fetchConversation } from '@/services/conversation';

/**
 * Load a specific conversation by ID
 */
export const loadExistingConversation = async (
  conversationId: string, 
  userId: string
): Promise<ConversationSession | null> => {
  try {
    console.log(`Attempting to load specific conversation ID: ${conversationId}`);
    
    const conversation = await fetchConversation(conversationId, userId);
    
    if (conversation) {
      console.log(`Successfully loaded conversation ${conversationId} with ${conversation.messages.length} messages`);
      
      // Convert to ConversationSession format
      const conversationSession: ConversationSession = {
        id: conversation.id,
        userId: conversation.userId,
        type: conversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: conversation.title,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.createdAt
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
      
      saveCurrentConversationToStorage(conversationSession);
      return conversationSession;
    } else {
      console.log(`Conversation ${conversationId} not found or not accessible`);
      return null;
    }
  } catch (err) {
    console.error(`Error loading conversation ${conversationId}:`, err);
    return null;
  }
};

/**
 * Create a new conversation with initial assistant message
 */
export const createConversationWithInitialMessage = async (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  initialMessage: string,
  startConversationFn: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>,
  addMessageFn: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<boolean>
): Promise<ConversationSession | null> => {
  try {
    console.log(`Creating new ${type} conversation`);
    const conversation = await startConversationFn(type);
    
    // Add initial message and ensure we're capturing the boolean result
    const messageAdded = await addMessageFn(
      conversation.id,
      initialMessage,
      'assistant' as const
    );
    
    if (!messageAdded) {
      console.warn('Initial message may not have been added properly');
    }
    
    const updatedSession: ConversationSession = {
      ...conversation,
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: initialMessage,
          timestamp: new Date(),
        },
      ],
    };
    
    saveCurrentConversationToStorage(updatedSession);
    return updatedSession;
  } catch (err) {
    console.error(`Error creating ${type} conversation:`, err);
    throw err;
  }
};

/**
 * Determine appropriate initial message based on conversation type and context
 */
export const determineInitialMessage = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  isFirstVisit: boolean
): string => {
  if (isFirstVisit && type === 'story') {
    return "I'm excited to hear your story! What would you like to talk about today?";
  }
  
  return getInitialMessage(type);
};
