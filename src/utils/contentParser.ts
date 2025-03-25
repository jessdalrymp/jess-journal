import { JournalEntry } from "@/lib/types";

/**
 * Extracts and formats content from a journal entry
 */
export const getContentPreview = (entry: JournalEntry): string => {
  // Default to empty string if content is missing
  if (!entry.content) {
    return 'No content available';
  }
  
  // Try to parse content as JSON if it has a JSON code block
  return extractFormattedContent(entry.content);
};

/**
 * Extracts formatted content from text that might contain JSON code blocks
 */
export const extractFormattedContent = (content: string): string => {
  try {
    // Check if content contains a JSON code block
    if (content.includes('```json') && content.includes('```')) {
      const jsonMatch = content.match(/```json\n([\s\S]*?)```/);
      
      if (jsonMatch && jsonMatch[1]) {
        const jsonContent = JSON.parse(jsonMatch[1]);
        
        // If there's a content or summary field, use that
        if (jsonContent.content) {
          return jsonContent.content;
        }
        
        if (jsonContent.summary) {
          return jsonContent.summary;
        }
        
        // Otherwise return a stringified version of the object
        return Object.entries(jsonContent)
          .filter(([key]) => key !== 'title' && key !== 'type')
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }
    }
    
    // If no JSON or parsing failed, return the raw content
    return content;
  } catch (error) {
    console.error('Error parsing content:', error);
    return content;
  }
};

/**
 * Tries to parse JSON content from a code block in the content string
 */
export const parseContentWithJsonCodeBlock = (content: string) => {
  try {
    const jsonMatch = content.match(/```json\n([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    return null;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return null;
  }
};
