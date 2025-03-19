import { supabase } from '../../integrations/supabase/client';
import { Conversation, ConversationMessage } from '../../lib/types';

// Local cache for conversation data
const conversationCache = new Map<string, Conversation>();

// Get cached conversation
const getCachedConversation = (conversationId: string): Conversation | undefined => {
  return conversationCache.get(conversationId);
};

// Store conversation in cache
const cacheConversation = (conversation: Conversation) => {
  conversationCache.set(conversation.id, conversation);
};

// Clear cache for a conversation
const clearConversationCache = (conversationId: string) => {
  conversationCache.delete(conversationId);
};

// Clear all conversation cache
export const clearAllConversationCache = () => {
  conversationCache.clear();
};

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('profile_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      userId: item.profile_id,
      type: item.type,
      title: item.title,
      messages: [],
      summary: item.summary || '',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    return [];
  }
};

export const fetchConversation = async (conversationId: string, userId: string): Promise<Conversation | null> => {
  try {
    // Check cache first
    const cachedConversation = getCachedConversation(conversationId);
    if (cachedConversation) {
      return cachedConversation;
    }

    // Otherwise fetch from database
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('profile_id', userId)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Fetch messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return null;
    }

    // Build conversation object
    const conversation: Conversation = {
      id: data.id,
      userId: data.profile_id,
      type: data.type,
      title: data.title,
      messages: messages || [],
      summary: data.summary || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    // Cache the conversation
    cacheConversation(conversation);
    return conversation;
  } catch (error) {
    console.error('Error in fetchConversation:', error);
    return null;
  }
};

export const createConversation = async (params: {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}): Promise<Conversation | null> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        profile_id: params.userId,
        type: params.type,
        title: params.title,
        summary: ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    const conversation: Conversation = {
      id: data.id,
      userId: data.profile_id,
      type: data.type,
      title: data.title,
      messages: [],
      summary: '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
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
        role: message.role,
        content: message.content,
        metadata: message.metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Clear the cache for this conversation
    clearConversationCache(conversationId);

    return {
      id: data.id,
      role: data.role,
      content: data.content,
      metadata: data.metadata || {},
      createdAt: new Date(data.created_at)
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
      .from('conversations')
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
    const { error } = await supabase
      .from('conversations')
      .update({ summary, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation summary:', error);
      return false;
    }

    // Clear the cache for this conversation
    clearConversationCache(conversationId);
    return true;
  } catch (error) {
    console.error('Error in updateConversationSummary:', error);
    return false;
  }
};

export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    // First delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (messagesError) {
      console.error('Error deleting conversation messages:', messagesError);
      return false;
    }

    // Then delete the conversation itself
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }

    // Clear the cache for this conversation
    clearConversationCache(conversationId);
    return true;
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    return false;
  }
};
