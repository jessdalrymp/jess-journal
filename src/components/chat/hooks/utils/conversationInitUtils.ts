
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
      return null;
    }
    
    if (!conversationId) {
      console.error('Cannot load conversation: No conversation ID provided');
      return null;
    }
    
    console.log(`Attempting to load specific conversation ID: ${conversationId} for user: ${userId}`);
    
    const conversation = await fetchConversation(conversationId, userId);
    
    if (conversation) {
      console.log(`Successfully loaded conversation ${conversationId} with ${conversation.messages.length} messages`);
      
      // Ensure messages is always an array
      if (!conversation.messages || !Array.isArray(conversation.messages)) {
        console.error(`Conversation ${conversationId} has no messages or invalid message format`);
        throw new Error("Invalid conversation format: messages missing or not an array");
      }

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
          timestamp: msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt)
        })),
        createdAt: conversation.createdAt instanceof Date ? conversation.createdAt : new Date(conversation.createdAt),
        updatedAt: conversation.updatedAt instanceof Date ? conversation.updatedAt : new Date(conversation.updatedAt)
      };
      
      saveCurrentConversationToStorage(conversationSession);
      return conversationSession;
    } else {
      console.log(`Conversation ${conversationId} not found or not accessible`);
      throw new Error(`Conversation ${conversationId} not found or not accessible`);
    }
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
  userId: string,
  startConversationFn: (userId: string, type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<any>,
  addMessageFn: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<boolean>
): Promise<ConversationSession | null> => {
  try {
    // Get the appropriate initial message for this conversation type
    const initialMessage = getInitialMessage(type);
    console.log(`Creating new ${type} conversation with initial message`);
    
    // Start the conversation
    const conversation = await startConversationFn(userId, type);
    
    if (!conversation || !conversation.id) {
      console.error('Failed to create conversation - no ID returned');
      throw new Error('Failed to create conversation - no ID returned');
    }
    
    console.log(`Successfully created ${type} conversation with ID ${conversation.id}, adding initial message`);
    
    // Add initial message to the conversation
    await addMessageFn(
      conversation.id,
      initialMessage,
      'assistant'
    );
    
    // Create the session object with the initial message
    const updatedSession: ConversationSession = {
      id: conversation.id,
      userId: userId,
      type: type,
      title: conversation.title || `New ${type}`,
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date(),
        },
      ],
      createdAt: conversation.createdAt instanceof Date ? conversation.createdAt : new Date(conversation.createdAt),
      updatedAt: conversation.updatedAt instanceof Date ? conversation.updatedAt : new Date(conversation.updatedAt)
    };
    
    // Save to storage and return
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
