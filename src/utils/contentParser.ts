
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
 */
export const parseEntryContent = (content: string): any => {
  try {
    // Try to extract JSON block from content
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try parsing the whole content as JSON
    return JSON.parse(content);
  } catch (error) {
    // Return null if parsing fails
    return null;
  }
};
