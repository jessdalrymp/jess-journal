
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from './encryption';

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (entryId: string, content: string, userId: string, prompt?: string, type?: string): Promise<boolean> => {
  if (!userId || !entryId) return false;
  
  try {
    // Don't allow empty content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      console.error('Cannot save empty content');
      return false;
    }
    
    // Encrypt the content before updating
    const encryptedContent = encryptContent(trimmedContent, userId);
    
    // Build the update object with required fields
    const updateData: { content: string; prompt?: string; type?: string } = {
      content: encryptedContent
    };
    
    // Add optional fields if provided
    if (prompt) updateData.prompt = prompt;
    if (type) updateData.type = type;
    
    console.log(`Updating entry ${entryId} with type: ${type}, prompt length: ${prompt?.length || 0}`);
    
    const { error, data } = await supabase
      .from('journal_entries')
      .update(updateData)
      .eq('id', entryId)
      .select();

    if (error) {
      console.error('Error updating journal entry:', error);
      return false;
    }

    console.log(`Successfully updated entry ${entryId}`);
    return true;
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return false;
  }
};
