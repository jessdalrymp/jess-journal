
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from './encryption';

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (entryId: string, content: string, userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Encrypt the content before updating
    const encryptedContent = encryptContent(content, userId);
    
    // Updated table name from "journal_entries" to "Journal_Entries" and column from "content" to "Content"
    const { error } = await supabase
      .from('Journal_Entries')
      .update({ Content: encryptedContent })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};
