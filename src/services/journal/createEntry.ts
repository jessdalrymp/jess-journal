
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
  
  // Check if content is empty
  let contentToCheck = content;
  try {
    const parsedContent = parseContentWithJsonCodeBlock(content);
    if (parsedContent && parsedContent.summary) {
      contentToCheck = parsedContent.summary;
    }
  } catch (e) {
    console.error('Error parsing content:', e);
  }
  
  // Don't save if the content is empty
  if (!contentToCheck.trim()) {
    console.log('Skipping save for empty journal entry');
    return null;
  }

  try {
    // Encrypt the content before saving
    const encryptedContent = encryptContent(content, userId);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content: encryptedContent,
        type
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
