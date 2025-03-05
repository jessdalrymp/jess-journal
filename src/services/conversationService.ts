import { ConversationSession, ChatMessage } from '../lib/types';
import { supabase } from '../integrations/supabase/client';
import { getCurrentConversationFromStorage, saveCurrentConversationToStorage } from '../lib/storageUtils';

export const startConversation = async (userId: string | undefined, type: 'story' | 'sideQuest' | 'action' | 'journal'): Promise<ConversationSession> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // First check if we have a cached conversation
    const cachedConversation = getCurrentConversationFromStorage(type);
    if (cachedConversation && cachedConversation.userId === userId) {
      console.log(`Loaded ${type} conversation from localStorage`);
      return cachedConversation;
    }

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
      
      const conversation = {
        id: existingConv.id,
        userId: existingConv.user_id,
        type: existingConv.type as 'story' | 'sideQuest' | 'action' | 'journal',
        title: existingConv.title,
        messages: messages,
        summary: existingConv.summary || undefined,
        createdAt: new Date(existingConv.created_at),
        updatedAt: new Date(existingConv.updated_at)
      };

      // Save to localStorage for faster loading next time
      saveCurrentConversationToStorage(conversation);
      console.log(`Loaded ${type} conversation from Supabase and cached to localStorage`);
      
      return conversation;
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
    
    const conversation = {
      id: newConversation.id,
      userId: newConversation.user_id,
      type: newConversation.type as 'story' | 'sideQuest' | 'action' | 'journal',
      title: newConversation.title,
      messages: [],
      summary: newConversation.summary || undefined,
      createdAt: new Date(newConversation.created_at),
      updatedAt: new Date(newConversation.updated_at)
    };

    // Save to localStorage
    saveCurrentConversationToStorage(conversation);
    console.log(`Created new ${type} conversation and cached to localStorage`);
    
    return conversation;
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

export const saveConversationSummary = async (
  userId: string, 
  title: string, 
  summary: string, 
  conversationId: string
): Promise<void> => {
  try {
    console.log('Saving conversation summary with:', {
      userId, 
      title: title || 'Conversation Summary', 
      summary: summary || 'No summary available', 
      conversationId
    });
    
    // Save the summary to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title || 'Conversation Summary',
        content: summary || 'No summary available',
        conversation_id: conversationId,
        type: 'story_summary'
      });
    
    if (error) {
      console.error('Error saving conversation summary to journal_entries:', error);
      throw error;
    }
    
    // Also update the conversations table with the summary
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ summary: summary || 'No summary available' })
      .eq('id', conversationId);
    
    if (updateError) {
      console.error('Error updating conversation with summary:', updateError);
      // Not throwing here as the journal entry was already created
    }
    
    // Update the cached conversation if it exists
    const cachedConversation = getCurrentConversationFromStorage('story');
    if (cachedConversation && cachedConversation.id === conversationId) {
      cachedConversation.summary = summary || 'No summary available';
      saveCurrentConversationToStorage(cachedConversation);
    }
    
    console.log('Successfully saved conversation summary');
  } catch (error) {
    console.error('Error in saveConversationSummary:', error);
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
        content,
        type: 'journal'
      });

    if (error) {
      console.error('Error saving journal entry from conversation:', error);
      return;
    }
  } catch (error) {
    console.error('Error processing journal entry from conversation:', error);
  }
};
