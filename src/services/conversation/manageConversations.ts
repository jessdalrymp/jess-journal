
import { ConversationSession } from '@/lib/types';
import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';

/**
 * Create a new conversation in the database
 */
export const createConversation = async (params: {
  userId: string;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  title: string;
}): Promise<Conversation> => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      profile_id: params.userId,
      type: params.type,
      title: params.title || `New ${params.type} conversation`,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned when creating conversation');
  }

  return {
    id: data.id,
    userId: data.profile_id,
    type: data.type,
    title: data.title,
    messages: [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

/**
 * Add a message to an existing conversation in the database
 */
export const addMessageToConversation = async (
  conversationId: string,
  messageData: {
    role: 'user' | 'assistant';
    content: string;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: messageData.role,
      content: messageData.content,
    });

  if (error) {
    console.error('Error adding message to conversation:', error);
    throw error;
  }

  // Update the conversation's updated_at timestamp
  await updateConversationTimestamp(conversationId);

  return true;
};

/**
 * Update the timestamp of a conversation to mark it as recently accessed
 */
export const updateConversationTimestamp = async (conversationId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) {
    console.error('Error updating conversation timestamp:', error);
    // Don't throw here, just log the error
  }
};

/**
 * Update a conversation's title or other metadata
 */
export const updateConversationMetadata = async (
  conversationId: string,
  data: {
    title?: string;
    summary?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .update(data)
    .eq('id', conversationId);

  if (error) {
    console.error('Error updating conversation metadata:', error);
    throw error;
  }
};

/**
 * Retrieve a specific message from a conversation
 */
export const getMessageById = async (messageId: string): Promise<any> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) {
    console.error('Error retrieving message:', error);
    throw error;
  }

  return data;
};
