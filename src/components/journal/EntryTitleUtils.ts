
import { JournalEntry } from '@/lib/types';

/**
 * Get a title for the journal entry
 * Handles both standard journal entries and conversation summaries
 */
export const getEntryTitle = (entry: JournalEntry): string => {
  // If the entry already has a title, use it
  if (entry.title && entry.title !== 'Untitled Entry') {
    return entry.title;
  }
  
  // For entries with a conversation, use a more descriptive title
  if (entry.conversation_id) {
    switch (entry.type) {
      case 'story':
        return 'My Story Conversation';
      case 'sideQuest':
        return 'Side Quest Conversation';
      case 'action':
        return 'Action Challenge';
      case 'summary':
        return `Journal Summary: ${new Date(entry.createdAt).toLocaleDateString()}`;
      default:
        return 'Journal Conversation';
    }
  }
  
  // If we have a prompt, use that as the title
  if (entry.prompt) {
    // Truncate long prompts
    return entry.prompt.length > 50 
      ? entry.prompt.substring(0, 50) + '...'
      : entry.prompt;
  }
  
  // Default title based on type
  switch (entry.type) {
    case 'story':
      return 'My Story';
    case 'sideQuest':
      return 'Side Quest';
    case 'action':
      return 'Action Challenge';
    case 'summary':
      return `Journal Summary: ${new Date(entry.createdAt).toLocaleDateString()}`;
    default:
      return `Journal Entry: ${new Date(entry.createdAt).toLocaleDateString()}`;
  }
};

