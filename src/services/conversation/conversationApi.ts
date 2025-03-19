import { supabase } from '../../integrations/supabase/client';
import { ConversationSession, ChatMessage } from '../../lib/types';

// Helper to convert database timestamps to JavaScript Date objects
const dbTimestampToDate = (timestamp: string | null): Date => {
  return timestamp ? new Date(timestamp) : new Date();
};

/**
 * Fetch all conversations for a user
 */
export async function fetchConversations(userId: string): Promise<ConversationSession[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('profile_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return (data || []).map(conv => ({
      id: conv.id,
      userId: conv.profile_id, // Map profile_id to userId for consistency
      type: conv.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: conv.title || 'Untitled Conversation',
      messages: [],
      summary: conv.summary || '',
      createdAt: dbTimestampToDate(conv.created_at),
      updatedAt: dbTimestampToDate(conv.updated_at)
    }));
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    throw error;
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  title: string
): Promise<ConversationSession> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        profile_id: userId, // Use profile_id instead of user_id
        type,
        title
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    return {
      id: data.id,
      userId: data.profile_id, // Map profile_id to userId for consistency
      type: data.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: data.title,
      messages: [],
      summary: data.summary || '',
      createdAt: dbTimestampToDate(data.created_at),
      updatedAt: dbTimestampToDate(data.updated_at)
    };
  } catch (error) {
    console.error('Error in createConversation:', error);
    throw error;
  }
}

/**
 * Starts or retrieves an existing conversation for a user
 */
export const startConversation = async (userId: string | undefined, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // First check if we have a cached conversation
    const cachedConversation = getCachedConversation(type, userId);
    if (cachedConversation) {
      console.log(`Loaded ${type} conversation from localStorage`);
      return cachedConversation;
    }

    const { data: existingConversations, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('profile_id', userId)
      .eq('type', type)
      .order('updated_at', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching conversations:', fetchError);
      throw fetchError;
    }
    
    if (existingConversations && existingConversations.length > 0) {
      const existingConv = existingConversations[0];
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', existingConv.id)
        .order('timestamp', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }
      
      const messages: ChatMessage[] = messagesData ? messagesData.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      })) : [];
      
      const conversation = {
        id: existingConv.id,
        userId: existingConv.profile_id, // Map profile_id to userId for consistency
        type: existingConv.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: existingConv.title,
        messages: messages,
        summary: existingConv.summary || undefined,
        createdAt: new Date(existingConv.created_at),
        updatedAt: new Date(existingConv.updated_at)
      };

      // Save to localStorage for faster loading next time
      cacheConversation(conversation);
      console.log(`Loaded ${type} conversation from Supabase and cached to localStorage`);
      
      return conversation;
    }
    
    const newConversationData = {
      profile_id: userId,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Conversation`,
    };
    
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert(newConversationData)
      .select()
      .single();
    
    if (createError || !newConversation) {
      console.error('Error creating conversation:', createError);
      throw createError || new Error('Failed to create conversation');
    }
    
    const conversation = {
      id: newConversation.id,
      userId: newConversation.profile_id, // Map profile_id to userId for consistency
      type: newConversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: newConversation.title,
      messages: [],
      summary: newConversation.summary || undefined,
      createdAt: new Date(newConversation.created_at),
      updatedAt: new Date(newConversation.updated_at)
    };

    // Save to localStorage
    cacheConversation(conversation);
    console.log(`Created new ${type} conversation and cached to localStorage`);
    
    return conversation;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

/**
 * Adds a message to an existing conversation
 */
export const addMessageToConversation = async (
  conversationId: string, 
  content: string, 
  role: 'user' | 'assistant',
  userId?: string
): Promise<void> => {
  try {
    const newMessageData = {
      conversation_id: conversationId,
      content,
      role
    };
    
    const { error: messageError } = await supabase
      .from('messages')
      .insert(newMessageData);
    
    if (messageError) {
      console.error('Error adding message:', messageError);
      throw messageError;
    }
    
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    if (updateError) {
      console.error('Error updating conversation timestamp:', updateError);
      throw updateError;
    }
    
    // If this is a journal or sideQuest conversation and the AI responded, create a journal entry
    const { data: conversationData, error: fetchError } = await supabase
      .from('conversations')
      .select('type')
      .eq('id', conversationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching conversation type:', fetchError);
      return;
    }
    
    if ((conversationData.type === 'journal' || conversationData.type === 'sideQuest') && role === 'assistant' && userId) {
      const { data: userMessages, error: userMessagesError } = await supabase
        .from('messages')
        .select('content')
        .eq('conversation_id', conversationId)
        .eq('role', 'user')
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (userMessagesError || !userMessages || userMessages.length === 0) {
        console.error('Error fetching user messages:', userMessagesError);
        return;
      }
      
      const prompt = userMessages[0].content;
      
      // Import dynamically to avoid circular dependencies
      const { saveJournalEntryFromConversation } = await import('./journalIntegration');
      await saveJournalEntryFromConversation(userId, prompt, content, conversationData.type);
    }
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    throw error;
  }
};
