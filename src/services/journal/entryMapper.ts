
import { JournalEntry } from '@/lib/types';
import { decryptContent } from './encryption';
import { parseContentWithJsonCodeBlock } from './contentParser';

/**
 * Maps database journal entry object to application JournalEntry type
 * with improved error handling for decryption
 */
export const mapDatabaseEntryToJournalEntry = (
  entry: any, 
  userId: string
): JournalEntry => {
  let content = '';
  let prompt = entry.prompt || null;
  
  // Try to decrypt the content, but handle errors gracefully
  try {
    content = decryptContent(entry.content, userId);
  } catch (error) {
    console.error('Error decrypting content:', error);
    // Use raw content if decryption fails
    content = entry.content || '';
  }
  
  // Try to parse the content as JSON
  let parsedContent = null;
  let entryType = entry.type || 'journal';
  let title = prompt ? prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '') : 'Untitled Entry';
  
  try {
    parsedContent = parseContentWithJsonCodeBlock(content);
    
    // Use the parsed title if available
    if (parsedContent && parsedContent.title) {
      title = parsedContent.title;
    }
    
    // Use the parsed type if available
    if (parsedContent && parsedContent.type) {
      entryType = parsedContent.type;
    }
  } catch (error) {
    console.error('Error parsing content:', error);
    // Continue without parsedContent if parsing fails
  }

  return {
    id: entry.id,
    userId: entry.user_id,
    title: title,
    content: content,
    type: entryType as 'journal' | 'story' | 'sideQuest' | 'action',
    createdAt: new Date(entry.created_at),
    prompt: prompt
  };
};
