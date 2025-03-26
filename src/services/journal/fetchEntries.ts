
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/lib/types';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';
import { decryptContent } from './encryption';

/**
 * Fetches all journal entries for a user
 */
export const fetchJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  if (!userId) {
    console.warn('fetchJournalEntries called without a user ID');
    return [];
  }

  try {
    console.log(`Fetching journal entries for user ${userId}`);
    
    // Fetch entries from the journal_entries table where user_id matches
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`No journal entries found for user ${userId}`);
      return [];
    }

    console.log(`Found ${data.length} journal entries for user ${userId}`);
    console.log('Entry dates sample:', data.slice(0, 3).map(entry => ({ 
      id: entry.id,
      date: new Date(entry.created_at).toISOString(),
      type: entry.type
    })));
    
    // Log a quick sample of what the latest entries look like
    const latest = data[0];
    console.log('Latest entry:', {
      id: latest.id, 
      date: new Date(latest.created_at).toISOString(),
      type: latest.type,
      prompt: latest.prompt?.substring(0, 50),
      createdAt: latest.created_at,
      conversationId: latest.conversation_id
    });
    
    // Log the oldest entry too for comparison
    const oldest = data[data.length - 1];
    console.log('Oldest entry:', {
      id: oldest.id, 
      date: new Date(oldest.created_at).toISOString(),
      conversationId: oldest.conversation_id
    });

    // For conversation summaries, fetch the associated messages
    const conversationEntries = data.filter(entry => entry.conversation_id);
    console.log(`Found ${conversationEntries.length} entries with conversation_id`);
    
    if (conversationEntries.length > 0) {
      for (const entry of conversationEntries.slice(0, 3)) { // Process first 3 for logging
        console.log(`Checking messages for conversation: ${entry.conversation_id}`);
        
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation', entry.conversation_id)
          .limit(3);
        
        if (messagesError) {
          console.error(`Error fetching messages for conversation ${entry.conversation_id}:`, messagesError);
        } else {
          console.log(`Found ${messages?.length || 0} messages for conversation ${entry.conversation_id}`);
        }
      }
    }

    // Map database entries to JournalEntry type
    const entries = data.map(entry => {
      try {
        console.log(`Processing entry ${entry.id}, created at ${entry.created_at}, type ${entry.type}`);
        return mapDatabaseEntryToJournalEntry(entry, userId);
      } catch (err) {
        console.error(`Error mapping entry ${entry.id}:`, err);
        // Return a minimal valid entry for entries that can't be properly mapped
        return {
          id: entry.id,
          userId: entry.user_id,
          title: entry.prompt,
          content: '',
          createdAt: new Date(entry.created_at),
          type: entry.type || 'journal',
          prompt: entry.prompt,
          conversation_id: entry.conversation_id
        } as JournalEntry;
      }
    });

    return entries;
  } catch (error) {
    console.error('Error in fetchJournalEntries:', error);
    return [];
  }
};

/**
 * Fetches a single journal entry by its ID
 */
export const fetchJournalEntryById = async (entryId: string, userId: string): Promise<JournalEntry | null> => {
  if (!userId || !entryId) return null;

  try {
    console.log(`Fetching journal entry ${entryId} for user ${userId}`);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Error fetching journal entry ${entryId}:`, error);
      return null;
    }

    if (!data) {
      console.log(`No journal entry found with id ${entryId}`);
      return null;
    }

    return mapDatabaseEntryToJournalEntry(data, userId);
  } catch (error) {
    console.error(`Error fetching journal entry ${entryId}:`, error);
    return null;
  }
};
