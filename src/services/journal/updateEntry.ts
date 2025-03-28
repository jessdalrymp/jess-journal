
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from './encryption';

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (entryId: string, content: string, userId: string, prompt?: string, type?: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Encrypt the content before updating
    const encryptedContent = encryptContent(content, userId);
    
    // Build the update object, always including content
    const updateData: { content: string; prompt?: string; type?: string } = {
      content: encryptedContent
    };
    
    // Add optional fields if provided
    if (prompt) updateData.prompt = prompt;
    if (type) updateData.type = type;
    
    const { error } = await supabase
      .from('journal_entries')
      .update(updateData)
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
