
import { supabase } from '@/integrations/supabase/client';
import { encryptContent } from '../journal/encryption';

/**
 * Saves a conversation to the journal
 */
export const saveConversationToJournal = async (
  userId: string, 
  title: string, 
  conversationId: string, 
  type: 'story' | 'sideQuest' | 'action' | 'journal'
): Promise<boolean> => {
  try {
    console.log(`Saving conversation ${conversationId} to journal for user ${userId}`);
    
    // Get the conversation summary
    const { data: conversationData, error: conversationError } = await supabase
      .from('Conversation_id')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();
    
    if (conversationError || !conversationData) {
      console.error('Error fetching conversation:', conversationError);
      return false;
    }
    
    // Get the messages from the conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from('Messages')
      .select('*')
      .eq('conversation', conversationId)
      .order('timestamp', { ascending: true });
    
    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return false;
    }
    
    if (!messagesData || messagesData.length === 0) {
      console.error('No messages found for conversation:', conversationId);
      return false;
    }
    
    // Format the conversation as content
    const formattedContent = messagesData.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'Assistant';
      return `**${role}:** ${msg.content}`;
    }).join('\n\n');
    
    // Encrypt the content
    const encryptedContent = encryptContent(formattedContent, userId);
    
    // Create a journal entry with the conversation content
    const { data: journalEntry, error: journalError } = await supabase
      .from('Journal_Entries')
      .insert({
        User_id: userId,
        Prompt: title,
        Content: encryptedContent,
        Type: type,
        conversation_id: conversationId
      })
      .select()
      .single();
    
    if (journalError) {
      console.error('Error creating journal entry:', journalError);
      return false;
    }
    
    console.log(`Successfully saved conversation ${conversationId} to journal as entry ${journalEntry.id}`);
    return true;
  } catch (error) {
    console.error('Error in saveConversationToJournal:', error);
    return false;
  }
};
