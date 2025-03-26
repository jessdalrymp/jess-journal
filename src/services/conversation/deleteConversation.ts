
import { supabase } from '../../integrations/supabase/client';
import { clearConversationCache } from './conversationCache';

export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    // First delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (messagesError) {
      console.error('Error deleting conversation messages:', messagesError);
      return false;
    }

    // Then delete the conversation itself
    const { error } = await supabase
      .from('conversation_id')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }

    // Clear the cache for this conversation
    clearConversationCache(conversationId);
    return true;
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    return false;
  }
};
