
import { supabase } from '../../integrations/supabase/client';

/**
 * Saves a journal entry created from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string, 
  prompt: string, 
  content: string
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt,
        content,
        type: 'sideQuest' as 'journal' | 'story' | 'sideQuest' | 'action'
      });

    if (error) {
      console.error('Error saving journal entry from conversation:', error);
      return;
    }
    
    console.log('Successfully saved journal entry from conversation');
  } catch (error) {
    console.error('Error processing journal entry from conversation:', error);
  }
};
