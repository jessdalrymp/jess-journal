
import { supabase } from "@/integrations/supabase/client";
import { encryptContent } from "../journal/encryption";

/**
 * Saves a conversation summary to the journal
 */
export const saveConversationSummary = async (
  userId: string,
  title: string,
  summary: string,
  conversationId: string,
  conversationType: string,
  cleanJson?: string
) => {
  try {
    console.log(`Saving ${conversationType} conversation summary to journal for user ${userId}`);

    // Prepare content - either use provided cleanJson or create a new JSON object
    // This ensures we're not creating nested JSON structures
    let content;
    if (cleanJson) {
      // If cleanJson is provided, use it directly without extra wrapping
      content = cleanJson;
    } else {
      // Create a simple JSON structure
      content = JSON.stringify({
        title,
        summary,
        type: conversationType
      }, null, 2);
    }

    // Encrypt the content for storage
    const encryptedContent = encryptContent(`\`\`\`json\n${content}\n\`\`\``, userId);

    // Create a prompt that's clean and doesn't contain nested JSON
    const prompt = `Conversation Summary: ${title}`;

    // Save to the journal_entries table
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title: title, // Store the title explicitly
        content: encryptedContent,
        type: conversationType, // Store the conversation type
        prompt: prompt,
        conversation_id: conversationId // Link to the original conversation
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving conversation summary to journal:", error);
      return null;
    }

    console.log("Successfully saved summary to journal:", data.id);
    return data;
  } catch (error) {
    console.error("Exception saving conversation summary to journal:", error);
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
