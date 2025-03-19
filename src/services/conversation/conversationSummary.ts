
import { supabase } from '../../integrations/supabase/client';
import { updateCachedConversation } from './conversationCache';

/**
 * Saves a summary of a conversation to both the journal and the conversation record
 */
export const saveConversationSummary = async (
  userId: string, 
  title: string, 
  summary: string, 
  conversationId: string,
  conversationType: 'story' | 'sideQuest' | 'action' | 'journal' = 'story'
): Promise<void> => {
  try {
    console.log(`Saving ${conversationType} summary with:`, {
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
        type: conversationType
      });
    
    if (error) {
      console.error(`Error saving ${conversationType} summary to journal_entries:`, error);
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
    
    // After saving, check if the entry is properly stored
    const { data: checkData, error: checkError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();
      
    if (checkError) {
      console.error('Error verifying saved summary:', checkError);
    } else {
      console.log('Verified saved summary exists in database:', checkData);
    }
  } catch (error) {
    console.error('Error in saveConversationSummary:', error);
    throw error;
  }
};
