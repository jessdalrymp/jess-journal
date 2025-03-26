
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
  
  // Handle both old (capitalized) and new (lowercase) column names
  const createdAt = dbEntry.created_at || dbEntry.Created_at;
  const content = dbEntry.content || dbEntry.Content;
  const prompt = dbEntry.prompt || dbEntry.Prompt;
  const type = dbEntry.type || dbEntry.Type || 'journal';
  const conversation_id = dbEntry.conversation_id;
  const userId_ = dbEntry.user_id || dbEntry.User_id;
  
  if (!createdAt) {
    console.error('created_at is missing in database entry:', dbEntry);
    throw new Error('created_at is missing in database entry');
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
    userId: userId_,
    title: prompt || 'Untitled Entry',
    content: decryptedContent,
    createdAt: new Date(createdAt),
    type,
    prompt,
    conversation_id
  };
};
