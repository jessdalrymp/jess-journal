
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
    if (!userId) {
      console.error('Cannot load conversation: No user ID provided');
      throw new Error('No user ID provided');
    }
    
    if (!conversationId) {
      console.error('Cannot load conversation: No conversation ID provided');
      throw new Error('No conversation ID provided');
    }
    
    console.log(`Attempting to load specific conversation ID: ${conversationId} for user: ${userId}`);
    
    const conversation = await fetchConversation(conversationId, userId);
    
    if (!conversation) {
      console.error(`Conversation ${conversationId} not found or not accessible`);
      throw new Error(`Conversation ${conversationId} not found or not accessible`);
    }
    
    console.log(`Successfully loaded conversation ${conversationId} with ${conversation.messages?.length || 0} messages`);
    
    // Ensure messages is always an array
    if (!conversation.messages || !Array.isArray(conversation.messages) || conversation.messages.length === 0) {
      console.error(`Conversation ${conversationId} has no messages or invalid message format`);
      
      // Instead of throwing an error, add initial message as a fallback
      console.log(`Adding fallback initial message to conversation ${conversationId}`);
      conversation.messages = [{
        id: Date.now().toString(),
        role: 'assistant',
        content: getInitialMessage('story'),
        createdAt: new Date()
      }];
    }

    // Convert to ConversationSession format
    const conversationSession: ConversationSession = {
      id: conversation.id,
      userId: conversation.userId,
      type: conversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: conversation.title || 'My Story',
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
  } catch (err) {
    console.error(`Error loading conversation ${conversationId}:`, err);
    throw err;
  }
};

/**
 * Create a new conversation with initial assistant message
 */
export const createConversationWithInitialMessage = async (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  initialMessage: string,
  startConversationFn: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<any>,
  addMessageFn: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<boolean>
): Promise<ConversationSession | null> => {
  try {
    console.log(`Creating new ${type} conversation with initial message`);
    const conversation = await startConversationFn(type);
    
    // Add additional logging to debug the response
    console.log(`startConversation response:`, JSON.stringify(conversation));
    
    if (!conversation) {
      console.error('Failed to create conversation - conversation is null or undefined');
      throw new Error('Failed to create conversation - no data returned');
    }
    
    if (!conversation.id) {
      console.error('Failed to create conversation - no ID returned', conversation);
      throw new Error('Failed to create conversation - no ID was returned');
    }
    
    // Use the provided initial message directly
    console.log(`Adding initial message to conversation ${conversation.id}`);
    try {
      await addMessageFn(
        conversation.id,
        initialMessage,
        'assistant' as const
      );
    } catch (error) {
      console.warn(`Error adding initial message to conversation ${conversation.id}:`, error);
      // Continue anyway since we can recover from this
    }
    
    // Use the provided initial message for the conversation session
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
  // Always use the standard initial message from chatUtils for consistency
  return getInitialMessage(type);
};
