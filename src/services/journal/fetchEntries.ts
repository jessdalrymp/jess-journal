
import { JournalEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';

/**
 * Fetches all journal entries for a user
 */
export const fetchJournalEntries = async (userId: string | undefined): Promise<JournalEntry[]> => {
  if (!userId) return [];

  try {
    console.log('Fetching journal entries for user:', userId);
    
    // Fetch all journal entries including ones linked to conversations
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*, conversations:conversation_id(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No journal entries found for user:', userId);
      return [];
    }
    
    console.log(`Found ${data.length} journal entries, checking if any are conversation summaries`);
    
    // Check for conversation-linked entries
    const conversationEntries = data.filter(entry => entry.conversation_id);
    console.log(`Found ${conversationEntries.length} entries linked to conversations`);
    
    if (conversationEntries.length > 0) {
      console.log('Sample conversation entry:', conversationEntries[0]);
    }

    // Map entries and handle any errors in the mapping process
    const entries: JournalEntry[] = [];
    for (const entryData of data) {
      try {
        // Pass the conversation data to the mapper if available
        const conversationData = entryData.conversations || null;
        const entry = mapDatabaseEntryToJournalEntry(entryData, userId, conversationData);
        entries.push(entry);
      } catch (err) {
        console.error('Error processing journal entry:', err, entryData);
        // Create a fallback entry with minimal information
        const fallbackEntry: JournalEntry = {
          id: entryData.id,
          userId: entryData.user_id,
          title: entryData.prompt || 'Untitled Entry',
          content: 'Content could not be loaded',
          type: (entryData.type as 'journal' | 'story' | 'sideQuest' | 'action') || 'journal',
          createdAt: new Date(entryData.created_at),
          prompt: entryData.prompt || null,
          conversation_id: entryData.conversation_id || null
        };
        entries.push(fallbackEntry);
      }
    }
    
    return entries;
  } catch (error) {
    console.error('Error processing journal entries:', error);
    return [];
  }
};
