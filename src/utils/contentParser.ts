
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
    const jsonRegex = /```json\s*([\s\S]*?)```/g;
    const matches = [...content.matchAll(jsonRegex)];
    
    if (matches.length > 0) {
      // Process the first match (assuming it's the main content)
      const jsonString = matches[0][1].trim();
      try {
        const jsonContent = JSON.parse(jsonString);
        
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
      } catch (innerError) {
        console.error('Error parsing JSON content block:', innerError);
        // Return the raw JSON string if parsing fails
        return jsonString;
      }
    }
    
    // If no JSON or parsing failed, return the raw content
    // But first, clean up any markdown-style JSON code blocks
    return content.replace(/```json\s*[\s\S]*?```/g, '').trim();
  } catch (error) {
    console.error('Error parsing content:', error);
    // If JSON parsing fails, strip out the JSON code block syntax
    return content.replace(/```json|```/g, '').trim();
  }
};

/**
 * Parses content that might contain JSON code blocks and returns the parsed object
 */
export const parseEntryContent = (content: string) => {
  if (!content) return null;
  
  try {
    // Use a more flexible regex that can handle any whitespace between ```json and the content
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      const jsonString = jsonMatch[1].trim();
      return JSON.parse(jsonString);
    }
    return null;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return null;
  }
};

/**
 * Formats content for the editor to ensure it's editable
 */
export const formatContentForEditing = (entry: JournalEntry): string => {
  try {
    // If there's no content, return empty string
    if (!entry || !entry.content) {
      return '';
    }
    
    // Return the raw content if it doesn't have a JSON code block
    if (!entry.content.includes('```json')) {
      return entry.content;
    }
    
    // Parse the JSON content
    const parsedContent = parseEntryContent(entry.content);
    
    // If parsing failed, return the raw content
    if (!parsedContent) {
      return entry.content;
    }
    
    // Build a clean version for editing
    return entry.content;
  } catch (error) {
    console.error('Error formatting content for editing:', error);
    return entry.content || '';
  }
};

/**
 * Tries to parse JSON content from a code block in the content string
 * Alias of parseEntryContent for backward compatibility
 */
export const parseContentWithJsonCodeBlock = (content: string) => {
  return parseEntryContent(content);
};
