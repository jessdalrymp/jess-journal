
import { JournalEntry } from '@/lib/types';
import { supabase } from '../../integrations/supabase/client';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';
import { getConversationForJournalEntry } from '../conversation/journalIntegration';

/**
 * Fetches all journal entries for a user
 * @param userId - The user ID to fetch entries for
 * @param limit - Optional limit of entries to return
 * @param type - Optional filter by entry type
 * @returns Promise<JournalEntry[]> - A promise that resolves to an array of journal entries
 */
export const fetchJournalEntries = async (
  userId: string,
  limit?: number,
  type?: 'journal' | 'story' | 'sideQuest' | 'action' | 'summary'
): Promise<JournalEntry[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided to fetchJournalEntries');
      return [];
    }

    console.log(`Fetching journal entries for user ${userId}${type ? ` of type ${type}` : ''}`);

    // Build the query
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply type filter if specified
    if (type) {
      query = query.eq('type', type);
    }

    // Apply limit if specified
    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`No journal entries found for user ${userId}`);
      return [];
    }

    // Map database entries to JournalEntry objects
    const entries: JournalEntry[] = [];
    
    for (const entry of data) {
      try {
        const mappedEntry = mapDatabaseEntryToJournalEntry(entry);
        
        // Fetch conversation data if the entry has a conversation_id
        if (entry.conversation_id) {
          console.log(`Fetching conversation data for entry ${entry.id} with conversation_id ${entry.conversation_id}`);
          try {
            const conversation = await getConversationForJournalEntry(entry.id);
            if (conversation) {
              // Add conversation summary if available
              mappedEntry.conversationSummary = conversation.summary;
            }
          } catch (error) {
            console.error(`Error fetching conversation for entry ${entry.id}:`, error);
          }
        }
        
        entries.push(mappedEntry);
      } catch (error) {
        console.error(`Error processing journal entry ${entry.id}:`, error);
      }
    }

    console.log(`Successfully fetched ${entries.length} journal entries`);
    return entries;
  } catch (error) {
    console.error('Error in fetchJournalEntries:', error);
    return [];
  }
};

/**
 * Fetches a single journal entry by ID
 */
export const fetchJournalEntryById = async (
  entryId: string
): Promise<JournalEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .single();

    if (error) {
      console.error(`Error fetching journal entry ${entryId}:`, error);
      return null;
    }

    if (!data) {
      console.log(`Journal entry ${entryId} not found`);
      return null;
    }

    return mapDatabaseEntryToJournalEntry(data);
  } catch (error) {
    console.error(`Error in fetchJournalEntryById for ${entryId}:`, error);
    return null;
  }
};
