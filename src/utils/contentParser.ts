
import { JournalEntry } from '@/lib/types';

/**
 * Extracts a readable preview from entry content
 */
export const getContentPreview = (entry: JournalEntry): string => {
  try {
    // For entries with conversation_id, we want to be even more selective
    if (entry.conversation_id) {
      // Use the content directly for conversation summaries
      return entry.content;
    }
    
    // For regular journal entries, clean up the content
    let content = entry.content || '';
    
    // Remove any prompts from the beginning
    if (entry.prompt && content.startsWith(entry.prompt)) {
      content = content.substring(entry.prompt.length).trim();
    }
    
    // Return cleaned content
    return content || 'No content available';
  } catch (error) {
    console.error('Error processing entry content for preview:', error);
    return entry.content || 'No content available';
  }
};

/**
 * Parse entry content to extract structured data if available
 * Works with multiple JSON formats (code blocks, plain JSON strings)
 */
export const parseEntryContent = (content: string): any => {
  if (!content) return null;
  
  try {
    // Try to extract JSON from code blocks first (```json format)
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }
    
    // Try to extract JSON from code blocks without newlines (```json format)
    const jsonMatchInline = content.match(/```json\s+([\s\S]*?)\s+```/);
    if (jsonMatchInline && jsonMatchInline[1]) {
      return JSON.parse(jsonMatchInline[1].trim());
    }
    
    // Try parsing the whole content as JSON
    return JSON.parse(content);
  } catch (error) {
    // Return null if parsing fails
    return null;
  }
};

/**
 * Format content for editing in the journal entry editor
 * Removes prompts and handles JSON content
 */
export const formatContentForEditing = (entry: JournalEntry | string): string => {
  // Handle string input case (for backward compatibility)
  if (typeof entry === 'string') {
    return entry;
  }
  
  // Remove any prompt prefixes from the content if entry is JournalEntry
  if (entry.prompt && entry.content.startsWith(entry.prompt)) {
    return entry.content.substring(entry.prompt.length).trim();
  }
  
  return entry.content;
};

/**
 * Helper function to extract content from JSON code blocks 
 * or regular JSON strings for display in UI
 */
export const extractFormattedContent = (content: string): string => {
  if (!content) return '';
  
  // Try to parse as JSON first
  const parsedContent = parseEntryContent(content);
  if (parsedContent) {
    // If we have a summary field, use that
    if (parsedContent.summary) {
      return parsedContent.summary;
    }
    // If we have a content field, use that
    if (parsedContent.content) {
      return parsedContent.content;
    }
  }
  
  // Clean up markdown code block syntax if present
  let cleanedContent = content;
  cleanedContent = cleanedContent.replace(/```json\n/g, '');
  cleanedContent = cleanedContent.replace(/```/g, '');
  
  return cleanedContent.trim();
};
