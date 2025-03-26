
import { supabase } from "../../integrations/supabase/client";
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
    
    // Also update the conversation_id table with the summary
    const { error: updateError } = await supabase
      .from('conversation_id')
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
    
    // After saving, verify what was stored
    console.log('Verifying journal entry was created...');
    const { data: journalCheck, error: journalCheckError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();
      
    if (journalCheckError) {
      console.error('Error verifying journal entry:', journalCheckError);
    } else {
      console.log('Verified journal entry exists:', journalCheck);
    }
    
    console.log('Verifying conversation was updated...');
    const { data: conversationCheck, error: conversationCheckError } = await supabase
      .from('conversation_id')
      .select('*')
      .eq('id', conversationId)
      .single();
      
    if (conversationCheckError) {
      console.error('Error verifying conversation update:', conversationCheckError);
    } else {
      console.log('Verified conversation was updated:', conversationCheck);
    }
  } catch (error) {
    console.error('Error in saveConversationSummary:', error);
    throw error;
  }
};
