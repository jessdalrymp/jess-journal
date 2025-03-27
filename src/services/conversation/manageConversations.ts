
import { supabase } from '../../integrations/supabase/client';
import { Conversation, ConversationMessage } from './types';
import { cacheConversation, clearConversationCache } from './conversationCache';

export const createConversation = async (params: {
  userId: string;
  type: 'action' | 'journal' | 'sideQuest' | 'story';
  title: string;
}): Promise<Conversation | null> => {
  try {
    console.log('Creating conversation with params:', JSON.stringify(params));
    
    if (!params.userId) {
      console.error('Error creating conversation: No user ID provided');
      return null;
    }
    
    if (!params.type) {
      console.error('Error creating conversation: No type provided');
      return null;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        profile_id: params.userId,
        type: params.type,
        title: params.title || `New ${params.type} - ${new Date().toLocaleDateString()}`,
        summary: ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    if (!data) {
      console.error('No data returned from conversation creation');
      return null;
    }

    console.log('Conversation created successfully:', data.id);

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
        content: message.content
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
