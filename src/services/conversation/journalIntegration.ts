
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
