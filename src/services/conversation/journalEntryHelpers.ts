
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from '../journal/encryption';

/**
 * Saves a journal entry from conversation data
 */
export const saveJournalEntryFromConversation = async (
  userId: string,
  title: string,
  content: string,
  type: 'story' | 'sideQuest' | 'action' | 'journal' = 'journal'
): Promise<boolean> => {
  try {
    // Encrypt the content before saving
    const encryptedContent = encryptContent(content, userId);
    
    // Create a journal entry with the conversation content
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title,
        content: encryptedContent,
        type: type
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating journal entry:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveJournalEntryFromConversation:', error);
    return false;
  }
};
