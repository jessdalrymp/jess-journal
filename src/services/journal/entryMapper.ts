
import { JournalEntry } from '@/lib/types';

/**
 * Maps a database entry to a JournalEntry object
 */
export function mapDatabaseEntryToJournalEntry(dbEntry: any, userId: string): JournalEntry {
  return {
    id: dbEntry.id,
    userId: userId,
    content: dbEntry.content || '',
    type: dbEntry.type || 'journal',
    createdAt: new Date(dbEntry.created_at),
    prompt: dbEntry.prompt || null,
    summary: dbEntry.summary || null,
    title: dbEntry.title || undefined
  };
}
