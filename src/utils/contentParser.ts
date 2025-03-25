
/**
 * This file contains utility functions for parsing and formatting content.
 */

/**
 * Parses entry content to extract important information
 * @param content Raw content of the journal entry
 * @returns Parsed content or null if parsing fails
 */
export const parseEntryContent = (content: string) => {
  // Check for JSON code block
  const jsonCodeBlockRegex = /```json\s*([\s\S]*?)```/;
  const match = content.match(jsonCodeBlockRegex);
  
  if (match && match[1]) {
    try {
      const jsonContent = JSON.parse(match[1].trim());
      return jsonContent;
    } catch (error) {
      console.error("Error parsing JSON content:", error);
      return null;
    }
  }
  
  // If no JSON structure found, return null
  return null;
};

/**
 * Extracts a content preview from a journal entry
 * @param entry JournalEntry or string content of the entry 
 * @param maxLength Maximum length of the preview
 * @returns A plain text preview of the content
 */
export const getContentPreview = (entry: string | { content: string }, maxLength: number = 100): string => {
  // Handle when entry is a JournalEntry object
  const content = typeof entry === 'string' ? entry : entry.content;
  
  // First try to parse JSON content
  const parsedContent = parseEntryContent(content);
  
  if (parsedContent) {
    // Try to get summary from JSON
    if (parsedContent.summary) {
      const summary = parsedContent.summary.trim();
      if (summary.length > maxLength) {
        return summary.substring(0, maxLength) + '...';
      }
      return summary;
    }
    
    // If no summary, try other fields
    if (parsedContent.content) {
      const contentText = parsedContent.content.trim();
      if (contentText.length > maxLength) {
        return contentText.substring(0, maxLength) + '...';
      }
      return contentText;
    }
  }
  
  // If JSON parsing fails, treat as plain text
  // Remove markdown and JSON code blocks
  const plainContent = content
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();
    
  if (plainContent.length > maxLength) {
    return plainContent.substring(0, maxLength) + '...';
  }
  
  return plainContent;
};

/**
 * Formats content for editing in the editor
 * @param content Raw content from the database
 * @returns Formatted content suitable for editing
 */
export const formatContentForEditing = (content: string): string => {
  // Return the content as is for now - the editor component will handle parsing
  return content;
};
