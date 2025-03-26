
import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';

/**
 * Fetches a conversation associated with a journal entry
 */
export const getConversationForJournalEntry = async (conversationId: string): Promise<Conversation | null> => {
  try {
    // First check if the conversation exists
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (error || !conversation) {
      console.error(`No conversation found with id ${conversationId}:`, error);
      return null;
    }
    
    // Then fetch the messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (messagesError) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, messagesError);
      // Return the conversation without messages
      return {
        id: conversation.id,
        userId: conversation.profile_id,
        type: conversation.type,
        title: conversation.title,
        messages: [],
        summary: conversation.summary || '',
        createdAt: new Date(conversation.created_at),
        updatedAt: new Date(conversation.updated_at)
      };
    }
    
    // Return the conversation with messages
    return {
      id: conversation.id,
      userId: conversation.profile_id,
      type: conversation.type,
      title: conversation.title,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.timestamp)
      })),
      summary: conversation.summary || '',
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at)
    };
  } catch (error) {
    console.error('Error fetching conversation for journal entry:', error);
    return null;
  }
};
