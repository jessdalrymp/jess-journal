
import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes a journal entry
 */
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    // Updated table name from "journal_entries" to "Journal_Entries"
    const { error } = await supabase
      .from('Journal_Entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return false;
  }
};
