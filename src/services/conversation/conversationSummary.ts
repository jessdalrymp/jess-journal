
import { supabase } from '../../integrations/supabase/client';
import { updateCachedConversation } from './conversationCache';

/**
 * Saves a summary of a conversation to both the journal and the conversation record
 */
export const saveConversationSummary = async (
  userId: string, 
  title: string, 
  summary: string, 
  conversationId: string
): Promise<void> => {
  try {
    console.log('Saving conversation summary with:', {
      userId, 
      title: title || 'Conversation Summary', 
      summary: summary || 'No summary available', 
      conversationId
    });
    
    // Save the summary to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title || 'Conversation Summary',
        content: summary || 'No summary available',
        conversation_id: conversationId,
        type: 'story_summary' as 'journal' | 'story' | 'sideQuest' | 'action'
      });
    
    if (error) {
      console.error('Error saving conversation summary to journal_entries:', error);
      throw error;
    }
    
    // Also update the conversations table with the summary
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ 
        summary: summary || 'No summary available',
        title: title || 'Conversation Summary'
      })
      .eq('id', conversationId);
    
    if (updateError) {
      console.error('Error updating conversation with summary:', updateError);
      // Not throwing here as the journal entry was already created
    }
    
    // Update the cached conversation
    updateCachedConversation(conversationId, {
      summary: summary || 'No summary available',
      title: title || 'Conversation Summary'
    });
    
    console.log('Successfully saved conversation summary');
  } catch (error) {
    console.error('Error in saveConversationSummary:', error);
    throw error;
  }
};
