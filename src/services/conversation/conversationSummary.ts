
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
    
    // Format the content as proper JSON in a code block
    const formattedContent = formatSummaryContent(title, summary);
    
    // Save the summary to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title || 'Conversation Summary',
        content: formattedContent,
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
  } catch (error) {
    console.error('Error in saveConversationSummary:', error);
    throw error;
  }
};

/**
 * Helper function to format summary content as JSON with code blocks
 */
const formatSummaryContent = (title: string, summary: string): string => {
  const jsonObj = {
    title: title || 'Conversation Summary',
    summary: summary || 'No summary available'
  };
  
  return `\`\`\`json\n${JSON.stringify(jsonObj, null, 2)}\n\`\`\``;
};
