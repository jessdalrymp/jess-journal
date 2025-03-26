
import { supabase } from "@/integrations/supabase/client";
import { encryptContent } from "../journal/encryption";

/**
 * Saves a conversation to the journal without generating a summary
 */
export const saveConversationToJournal = async (
  userId: string,
  title: string,
  conversationId: string,
  conversationType: string
) => {
  try {
    console.log(`Saving ${conversationType} conversation to journal for user ${userId}`);

    // Create a simple content structure
    const content = JSON.stringify({
      title,
      type: conversationType
    }, null, 2);

    // Encrypt the content for storage
    const encryptedContent = encryptContent(`\`\`\`json\n${content}\n\`\`\``, userId);

    // Create a prompt
    const prompt = `Conversation: ${title}`;

    // Save to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title: title,
        content: encryptedContent,
        type: conversationType,
        prompt: prompt,
        conversation_id: conversationId
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving conversation to journal:", error);
      return null;
    }

    console.log("Successfully saved conversation to journal:", data.id);
    return data;
  } catch (error) {
    console.error("Exception saving conversation to journal:", error);
    return null;
  }
};

/**
 * Saves a journal entry from a conversation
 */
export const saveJournalEntryFromConversation = async (
  userId: string,
  title: string, 
  content: string,
  entryType: string
): Promise<boolean> => {
  try {
    console.log(`Saving journal entry from conversation for user ${userId}`);
    
    // Encrypt the content for storage
    const encryptedContent = encryptContent(content, userId);
    
    // Create a clean prompt
    const prompt = `Journal Entry: ${title}`;
    
    // Save to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title: title,
        content: encryptedContent,
        type: entryType,
        prompt: prompt
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error saving journal entry from conversation:", error);
      return false;
    }
    
    console.log("Successfully saved journal entry:", data.id);
    return true;
  } catch (error) {
    console.error("Exception saving journal entry from conversation:", error);
    return false;
  }
};

/**
 * Links a journal entry to a conversation
 */
export const linkJournalEntryToConversation = async (
  journalEntryId: string, 
  conversationId: string
): Promise<boolean> => {
  try {
    console.log(`Linking journal entry ${journalEntryId} to conversation ${conversationId}`);
    
    // Update the journal entry with the conversation ID
    const { error } = await supabase
      .from('journal_entries')
      .update({ conversation_id: conversationId })
      .eq('id', journalEntryId);
      
    if (error) {
      console.error("Error linking journal entry to conversation:", error);
      return false;
    }
    
    console.log("Successfully linked journal entry to conversation");
    return true;
  } catch (error) {
    console.error("Exception linking journal entry to conversation:", error);
    return false;
  }
};
