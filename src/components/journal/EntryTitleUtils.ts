
import { JournalEntry } from "@/lib/types";
import { parseEntryContent } from "@/utils/contentParser";

/**
 * Get a display title for an entry based on its content and metadata
 */
export const getEntryTitle = (entry: JournalEntry): string => {
  try {
    // Check if this is a conversation summary
    if (entry.conversation_id) {
      const parsedContent = parseEntryContent(entry.content);
      if (parsedContent && parsedContent.title) {
        return parsedContent.title;
      }
      return "Conversation Summary";
    }
    
    // First try to parse the content for structured entries
    const parsedContent = parseEntryContent(entry.content);
    if (parsedContent && parsedContent.title) {
      return parsedContent.title;
    }
    
    // For entries with a title field
    if (entry.title) {
      return entry.title;
    }
    
    // Use the prompt as a title for freewriting entries
    if (entry.prompt) {
      // Truncate long prompts
      const maxLength = 50;
      return entry.prompt.length > maxLength 
        ? entry.prompt.substring(0, maxLength) + "..." 
        : entry.prompt;
    }
    
    // Generic titles by type if all else fails
    const entryType = entry.type as string; // Cast to string to allow comparison with all possible types
    
    if (entryType === "action") {
      return "Action Challenge";
    } else if (entryType === "sideQuest") {
      return "Side Quest";
    } else if (entryType === "insights") {
      return "Daily Insights";
    } else if (entryType === "story") {
      return "My Story";
    } else if (entryType === "summary") {
      return "Conversation Summary";
    }
    
    // Default fallback
    return "Journal Entry";
  } catch (e) {
    console.error("Error getting entry title:", e);
    return "Journal Entry";
  }
};
