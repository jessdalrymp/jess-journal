
import { JournalEntry } from '@/lib/types';
import { decryptContent } from './encryption';

/**
 * Maps a database entry object to a JournalEntry type
 */
export const mapDatabaseEntryToJournalEntry = (entry: any): JournalEntry => {
  try {
    // Parse the content if it's encrypted
    let decryptedContent = '';
    try {
      decryptedContent = decryptContent(entry.content, entry.user_id);
    } catch (error) {
      console.error(`Error decrypting content for entry ${entry.id}:`, error);
      decryptedContent = entry.content;
    }

    // Handle json content parsing if needed
    let parsedContent = decryptedContent;
    let title = entry.title || '';

    // For story type entries, attempt to extract title from content
    if (entry.type === 'story' || entry.type === 'summary') {
      try {
        // Try to parse the first line as a title if no title exists
        if (!title && typeof parsedContent === 'string') {
          const lines = parsedContent.split('\n');
          if (lines.length > 0) {
            const firstLine = lines[0].trim();
            if (firstLine) {
              // If first line is a heading or starts with "Title:", extract it
              if (firstLine.startsWith('#') || firstLine.startsWith('Title:')) {
                title = firstLine.replace(/^#+ |^Title:\s*/i, '').trim();
              }
            }
          }
        }
      } catch (parseError) {
        console.error(`Error parsing title from content for entry ${entry.id}:`, parseError);
      }
    }

    return {
      id: entry.id,
      userId: entry.user_id,
      type: entry.type || 'journal',
      prompt: entry.prompt || '',
      content: parsedContent,
      topic: entry.topic || null,
      mood: entry.mood || null,
      title: title || null,
      createdAt: new Date(entry.created_at),
      updatedAt: new Date(entry.updated_at || entry.created_at),
      conversationId: entry.conversation_id || null,
      conversationSummary: null // This will be populated separately if needed
    };
  } catch (error) {
    console.error(`Error mapping database entry to JournalEntry:`, error);
    // Return a minimal valid entry
    return {
      id: entry.id || 'unknown',
      userId: entry.user_id || 'unknown',
      type: 'journal',
      prompt: entry.prompt || '',
      content: entry.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};
