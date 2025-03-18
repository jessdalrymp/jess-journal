
import { JournalEntry } from '@/lib/types';
import { decryptContent } from './encryption';
import { parseContentWithJsonCodeBlock } from './contentParser';

/**
 * Maps database journal entry object to application JournalEntry type
 */
export const mapDatabaseEntryToJournalEntry = (
  entry: any, 
  userId: string
): JournalEntry => {
  // Decrypt the content before processing
  const decryptedContent = decryptContent(entry.content, userId);
  
  // Try to parse the content as JSON
  const parsedContent = parseContentWithJsonCodeBlock(decryptedContent);
  
  // Use the parsed title if available, otherwise use the prompt
  const title = parsedContent && parsedContent.title 
    ? parsedContent.title 
    : entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : '');

  // Determine the entry type
  let entryType = entry.type || 'journal';
  if (parsedContent && parsedContent.type) {
    entryType = parsedContent.type;
  }

  return {
    id: entry.id,
    userId: entry.user_id,
    title: title,
    content: decryptedContent,
    type: entryType as 'journal' | 'story' | 'sideQuest' | 'action',
    createdAt: new Date(entry.created_at)
  };
};
