
import { JournalEntry } from "@/lib/types";
import { parseContentWithJsonCodeBlock } from "@/services/journal";

/**
 * Extracts a user-friendly title from journal entry content
 */
export const getEntryTitle = (entry: JournalEntry): string => {
  try {
    // Parse the content to get the user's answer instead of the question
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    
    if (parsedContent) {
      // If we have a summary field (user's answer), use that for the display
      if (parsedContent.summary) {
        // Use the first line or first 50 characters of the summary
        let summaryText = parsedContent.summary.split('\n')[0];
        
        // Replace third-person pronouns with second-person
        summaryText = summaryText
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
        
        return summaryText.length > 50 
          ? summaryText.substring(0, 50) + '...' 
          : summaryText;
      }
      
      // Fallback to title if present
      if (parsedContent.title) {
        // Also personalize the title if possible
        let title = parsedContent.title
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
          
        return title;
      }
    }
  } catch (e) {
    // Not valid JSON or doesn't have the expected fields
  }
  
  // Fallback to the original title
  return entry.title;
};
