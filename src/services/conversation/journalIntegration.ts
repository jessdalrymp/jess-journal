
import { supabase } from '../../integrations/supabase/client';

/**
 * Saves a journal entry created from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string, 
  prompt: string, 
  content: string,
  conversationType: 'journal' | 'sideQuest' | 'action' = 'journal'
): Promise<void> => {
  try {
    console.log(`Saving ${conversationType} entry from conversation for user ${userId}`);
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content,
        type: conversationType
      });

    if (error) {
      console.error(`Error saving ${conversationType} entry from conversation:`, error);
      return;
    }
    
    console.log(`Successfully saved ${conversationType} entry from conversation`);
  } catch (error) {
    console.error(`Error processing ${conversationType} entry from conversation:`, error);
  }
};
