
import { supabase } from '../../integrations/supabase/client';
import { Conversation } from './types';
import { saveJournalEntry } from '../journal';
import { updateConversationMetadata } from './manageConversations';

/**
 * Save a journal entry from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string, 
  prompt: string, 
  content: string, 
  type = 'journal'
): Promise<boolean> => {
  if (!userId) {
    console.error('No user ID provided for saveJournalEntryFromConversation');
    return false;
  }

  try {
    console.log(`Saving journal entry from conversation for user ${userId}`);
    const entry = await saveJournalEntry(userId, prompt, content, type);
    return !!entry;
  } catch (error) {
    console.error('Error saving journal entry from conversation:', error);
    return false;
  }
};

/**
 * Link an existing journal entry to a conversation
 */
export const linkJournalEntryToConversation = async (
  entryId: string,
  conversationId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .update({ conversation_id: conversationId })
      .eq('id', entryId);

    if (error) {
      console.error('Error linking journal entry to conversation:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in linkJournalEntryToConversation:', error);
    return false;
  }
};

/**
 * Get all journal entries linked to a conversation
 */
export const getJournalEntriesForConversation = async (
  conversationId: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('conversation_id', conversationId);

    if (error) {
      console.error('Error getting journal entries for conversation:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getJournalEntriesForConversation:', error);
    return [];
  }
};

/**
 * Get all conversations linked to a journal entry
 */
export const getConversationForJournalEntry = async (
  entryId: string
): Promise<Conversation | null> => {
  try {
    // First get the conversation_id from the journal entry
    const { data: entryData, error: entryError } = await supabase
      .from('journal_entries')
      .select('conversation_id')
      .eq('id', entryId)
      .single();

    if (entryError || !entryData || !entryData.conversation_id) {
      console.log('No conversation linked to this journal entry');
      return null;
    }

    // Then get the conversation details
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', entryData.conversation_id)
      .single();

    if (error) {
      console.error('Error getting conversation for journal entry:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.profile_id,
      type: data.type,
      title: data.title,
      messages: [],
      summary: data.summary || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error in getConversationForJournalEntry:', error);
    return null;
  }
};
