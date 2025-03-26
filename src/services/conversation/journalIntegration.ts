
import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';
import { JournalEntry } from '@/lib/types';

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

/**
 * Saves a journal entry from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string,
  title: string,
  content: string,
  type: 'journal' | 'story' | 'sideQuest' | 'action' | 'summary' = 'journal'
): Promise<JournalEntry | null> => {
  try {
    // Create a default prompt if none is provided
    const prompt = title;
    
    // Insert the journal entry
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content,
        type
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journal entry from conversation:', error);
      return null;
    }
    
    // Map the database record to the JournalEntry type
    return {
      id: data.id,
      userId: data.user_id,
      prompt: data.prompt,
      content: data.content,
      // The database doesn't have a title field, so we use the prompt as the title
      title: prompt,
      type: data.type as 'journal' | 'story' | 'sideQuest' | 'action' | 'summary',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at),
      conversationId: data.conversation_id
    };
  } catch (error) {
    console.error('Error saving journal entry from conversation:', error);
    return null;
  }
};
