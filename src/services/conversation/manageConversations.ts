
import { supabase } from '../../integrations/supabase/client';
import { Conversation, ConversationMessage } from './types';
import { cacheConversation, clearConversationCache } from './conversationCache';

export const createConversation = async (params: {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from('conversation_id')
      .insert({
        profile_id: params.userId,
        title: params.title,
        // Cast type to string since the database expects a string
        // even though it's defined as an enum in the schema
        type: params.type as string
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    const conversation: Conversation = {
      id: String(data.id),
      userId: data.profile_id,
      type: data.type || 'story',
      title: data.title || 'Untitled Conversation',
      messages: [],
      summary: '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at)
    };

    // Cache the conversation
    cacheConversation(conversation);
    return conversation;
  } catch (error) {
    console.error('Error in createConversation:', error);
    return null;
  }
};

export const addMessageToConversation = async (
  conversationId: string,
  message: Omit<ConversationMessage, 'id' | 'createdAt'>
): Promise<ConversationMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        // Cast role to string since the database expects a string
        // even though it's defined as an enum in the schema
        role: message.role as string,
        content: message.content,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversation_id')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Clear the cache for this conversation
    clearConversationCache(conversationId);

    return {
      id: String(data.id),
      role: data.role,
      content: data.content,
      createdAt: new Date(data.timestamp)
    };
  } catch (error) {
    console.error('Error in addMessageToConversation:', error);
    return null;
  }
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('conversation_id')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }

    // Clear the cache for this conversation
    clearConversationCache(conversationId);
    return true;
  } catch (error) {
    console.error('Error in updateConversationTitle:', error);
    return false;
  }
};

export const updateConversationSummary = async (
  conversationId: string,
  summary: string
): Promise<boolean> => {
  try {
    // Since the database doesn't have a summary column, we'll only update
    // the conversation's updated_at timestamp and handle summary in-memory
    const { error } = await supabase
      .from('conversation_id')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation timestamp:', error);
      return false;
    }

    // Clear the cache for this conversation
    clearConversationCache(conversationId);
    
    // Get the cached conversation and update it with the new summary
    const conversation = await fetchConversation(conversationId);
    if (conversation) {
      conversation.summary = summary;
      cacheConversation(conversation);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateConversationSummary:', error);
    return false;
  }
};

// Helper function to fetch a conversation
const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from('conversation_id')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: String(data.id),
      userId: data.profile_id,
      type: data.type || 'story',
      title: data.title || 'Untitled Conversation',
      messages: [],
      summary: '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at)
    };
  } catch (error) {
    console.error('Error fetching conversation in updateConversationSummary:', error);
    return null;
  }
};
