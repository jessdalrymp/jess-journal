
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
    
    // Handle nested JSON code blocks in prompts or content
    if (content.includes('```json\n```json')) {
      // Fix the nested JSON issue by extracting the innermost JSON block
      const cleanedContent = content.replace(/```json\n```json\n/, '```json\n');
      return extractFormattedContent(cleanedContent);
    }
    
    // Handle case where prompt JSON is incorrectly displayed
    const promptJsonPattern = /Journal Prompt:\s*```json\s*([\s\S]*?)\s*```/;
    const promptMatch = content.match(promptJsonPattern);
    
    if (promptMatch && promptMatch[1]) {
      try {
        const promptJson = JSON.parse(promptMatch[1]);
        if (promptJson.summary) {
          return promptJson.summary;
        }
      } catch (e) {
        // If parsing fails, continue with regular content
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
 * Parses content that might contain JSON code blocks and returns the parsed object
 */
export const parseEntryContent = (content: string) => {
  try {
    // Handle nested JSON code blocks
    if (content.includes('```json\n```json')) {
      const cleanedContent = content.replace(/```json\n```json\n/, '```json\n');
      return parseEntryContent(cleanedContent);
    }
    
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
