
import { JournalEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from './encryption';
import { parseContentWithJsonCodeBlock } from './contentParser';
import { mapDatabaseEntryToJournalEntry } from './entryMapper';

/**
 * Creates a new journal entry
 */
export const saveJournalEntry = async (
  userId: string | undefined, 
  prompt: string, 
  content: string,
  type = 'journal'
): Promise<JournalEntry | null> => {
  if (!userId) return null;

  try {
    // Encrypt the content before saving
    const encryptedContent = encryptContent(content, userId);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: prompt,
        content: encryptedContent,
        type: type
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving journal entry:', error);
      return null;
    }

    return mapDatabaseEntryToJournalEntry(data, userId);
  } catch (error) {
    console.error('Error processing journal entry:', error);
    return null;
  }
};
