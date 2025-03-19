import { JournalEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';
import { parseEntryContent } from './contentParser';

/**
 * Fetches all journal entries for a user
 */
export const fetchJournalEntries = async (userId: string | undefined): Promise<JournalEntry[]> => {
  if (!userId) return [];

  try {
    console.log('Fetching journal entries for user:', userId);
    
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
      console.log('No journal entries found for user:', userId);
      return [];
    }
    
    console.log(`Found ${data.length} journal entries`);

    // Map entries and handle any errors in the mapping process
    const entries: JournalEntry[] = [];
    for (const entryData of data) {
      try {
        // First try to map entry using the mapper which handles encryption
        const entry = mapDatabaseEntryToJournalEntry(entryData, userId);
        entries.push(entry);
      } catch (err) {
        console.error('Error processing journal entry:', err, entryData);
        
        // Create a fallback entry with minimal information
        // Try to extract title and summary from content if possible
        let title = entryData.prompt || 'Untitled Entry';
        let content = entryData.content || 'Content could not be loaded';
        
        // Check if content is valid JSON or has JSON blocks
        try {
          const parsedContent = parseEntryContent(content);
          if (parsedContent && parsedContent.title) {
            title = parsedContent.title;
          }
          if (parsedContent && parsedContent.summary) {
            content = parsedContent.summary;
          }
        } catch (parseErr) {
          // If parsing fails, keep the original content
        }
        
        const fallbackEntry: JournalEntry = {
          id: entryData.id,
          userId: entryData.user_id,
          title: title,
          content: content,
          type: (entryData.type as 'journal' | 'story' | 'sideQuest' | 'action') || 'journal',
          createdAt: new Date(entryData.created_at),
          prompt: entryData.prompt || null
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
