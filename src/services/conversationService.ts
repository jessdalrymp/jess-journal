
import { ConversationSession, ChatMessage } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

export const startConversation = async (userId: string | undefined, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const { data: existingConversations, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
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
      
      return {
        id: existingConv.id,
        userId: existingConv.user_id,
        type: existingConv.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: existingConv.title,
        messages: messages,
        summary: existingConv.summary || undefined,
        createdAt: new Date(existingConv.created_at),
        updatedAt: new Date(existingConv.updated_at)
      };
    }
    
    const newConversationData = {
      user_id: userId,
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
    
    return {
      id: newConversation.id,
      userId: newConversation.user_id,
      type: newConversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: newConversation.title,
      messages: [],
      summary: newConversation.summary || undefined,
      createdAt: new Date(newConversation.created_at),
      updatedAt: new Date(newConversation.updated_at)
    };
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

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
    
    const { data: conversationData, error: fetchError } = await supabase
      .from('conversations')
      .select('type')
      .eq('id', conversationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching conversation type:', fetchError);
      return;
    }
    
    if (conversationData.type === 'journal' && role === 'assistant' && userId) {
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
      await saveJournalEntryFromConversation(userId, prompt, content);
    }
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    throw error;
  }
};

const saveJournalEntryFromConversation = async (userId: string, prompt: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content
      });

    if (error) {
      console.error('Error saving journal entry from conversation:', error);
      return;
    }
  } catch (error) {
    console.error('Error processing journal entry from conversation:', error);
  }
};
