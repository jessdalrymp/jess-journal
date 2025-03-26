
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from '@/services/journal/encryption';

/**
 * Saves a conversation to the journal
 */
export const saveConversationToJournal = async (
  userId: string, 
  title: string, 
  conversationId: string, 
  type: 'story' | 'sideQuest' | 'action' | 'journal'
): Promise<string | null> => {
  try {
    console.log('Saving conversation to journal:', {
      userId,
      conversationId,
      type
    });
    
    // First, fetch the conversation to check if it exists
    const { data: conversation, error: conversationError } = await supabase
      .from('conversation_id')
      .select('*')
      .eq('id', conversationId)
      .eq('profile_id', userId)
      .single();
      
    if (conversationError || !conversation) {
      console.error('Error fetching conversation:', conversationError);
      return null;
    }
    
    // Fetch the messages for this conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
      
    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return null;
    }
    
    // Generate content from messages
    let content = '';
    if (messagesData && messagesData.length > 0) {
      content = messagesData.map(msg => {
        return `**${msg.role === 'user' ? 'You' : 'Assistant'}**: ${msg.content}`;
      }).join('\n\n');
    }
    
    // Encrypt the content
    const encryptedContent = encryptContent(content, userId);
    
    // Save to journal
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title,
        content: encryptedContent,
        type: type,
        conversation_id: conversationId
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error saving conversation to journal:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error in saveConversationToJournal:', error);
    return null;
  }
};

/**
 * Helper function to save a journal entry from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string,
  conversationId: string,
  title: string,
  content: string,
  type: 'story' | 'sideQuest' | 'action' | 'journal' = 'journal'
): Promise<string | null> => {
  try {
    // Encrypt the content
    const encryptedContent = encryptContent(content, userId);
    
    // Create a new journal entry
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        prompt: title,
        content: encryptedContent,
        type: type,
        conversation_id: conversationId
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating journal entry from conversation:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error in saveJournalEntryFromConversation:', error);
    return null;
  }
};
