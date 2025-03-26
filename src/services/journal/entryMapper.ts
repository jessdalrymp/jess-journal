
import { JournalEntry } from '@/lib/types';

/**
 * Maps a database entry to a JournalEntry object
 */
export const mapDatabaseEntryToJournalEntry = (dbEntry: any): JournalEntry => {
  // Convert camelCase to snake_case for database fields
  return {
    id: dbEntry.id,
    userId: dbEntry.user_id,
    prompt: dbEntry.prompt || '',
    content: dbEntry.content || '',
    title: dbEntry.title || undefined,
    topic: dbEntry.topic || undefined,
    mood: dbEntry.mood || undefined,
    type: dbEntry.type || 'journal',
    createdAt: new Date(dbEntry.created_at),
    updatedAt: new Date(dbEntry.updated_at),
    conversationId: dbEntry.conversation_id || undefined,
    conversationSummary: dbEntry.conversation_summary || undefined
  };
};

/**
 * Maps a JournalEntry object to a database entry
 */
export const mapJournalEntryToDatabaseEntry = (entry: JournalEntry) => {
  return {
    id: entry.id,
    user_id: entry.userId,
    prompt: entry.prompt,
    content: entry.content,
    title: entry.title,
    topic: entry.topic,
    mood: entry.mood,
    type: entry.type,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
    conversation_id: entry.conversationId,
    conversation_summary: entry.conversationSummary
  };
};
