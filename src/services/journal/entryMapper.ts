
import { JournalEntry } from '@/lib/types';
import { decryptContent } from './encryption';

/**
 * Maps a database entry to a JournalEntry object
 * Handles the changes in column naming
 */
export const mapDatabaseEntryToJournalEntry = (
  dbEntry: any, 
  userId: string
): JournalEntry => {
  if (!dbEntry) {
    throw new Error('Cannot map null database entry');
  }

  // Log the entry structure to debug
  console.log(`Mapping DB entry to JournalEntry, keys: ${Object.keys(dbEntry).join(', ')}`);
  
  // Maps both old (lowercase) and new (capitalized) column names
  const createdAt = dbEntry.Created_at || dbEntry.created_at;
  const content = dbEntry.Content || dbEntry.content;
  const prompt = dbEntry.Prompt || dbEntry.prompt;
  const type = dbEntry.Type || dbEntry.type || 'journal';
  const conversation_id = dbEntry.conversation_id;
  
  if (!createdAt) {
    console.error('Created_at is missing in database entry:', dbEntry);
    throw new Error('Created_at is missing in database entry');
  }

  // Decrypt the content if it exists
  let decryptedContent = '';
  if (content) {
    try {
      decryptedContent = decryptContent(content, userId);
    } catch (error) {
      console.error('Error decrypting content:', error);
      decryptedContent = content; // Fall back to encrypted content if decryption fails
    }
  }

  // Construct and return the JournalEntry object
  return {
    id: dbEntry.id,
    userId: dbEntry.User_id || dbEntry.user_id,
    title: prompt || 'Untitled Entry',
    content: decryptedContent,
    createdAt: new Date(createdAt),
    type,
    prompt,
    conversation_id
  };
};
