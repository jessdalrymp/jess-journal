
import { JournalEntry } from '@/lib/types';
import { parseContentWithJsonCodeBlock } from '@/services/journal/contentParser';

export const getEntryTitle = (entry: JournalEntry): string => {
  // If the entry has a title, use it
  if (entry.title) {
    return entry.title;
  }

  // For entries with a conversation_id, create a conversation title
  if (entry.conversation_id) {
    const conversationType = entry.type || 'journal';
    
    switch (conversationType) {
      case 'story':
        return 'Story Journey';
      case 'sideQuest':
        return 'Side Quest Adventure';
      case 'action':
        return 'Action Plan';
      case 'journal':
        return 'Journal Conversation';
      default:
        return `${conversationType.charAt(0).toUpperCase() + conversationType.slice(1)} Conversation`;
    }
  }

  // For summary entries, create a formatted title
  if (entry.type === 'summary') {
    // Try to extract a title from content if it's JSON
    try {
      const parsedContent = parseContentWithJsonCodeBlock(entry.content);
      if (parsedContent && parsedContent.title) {
        return parsedContent.title;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Fall back to a date-based title
    return `Daily Summary: ${new Date(entry.createdAt).toLocaleDateString()}`;
  }
  
  // For entries with a prompt, use that as the title
  if (entry.prompt) {
    return entry.prompt.substring(0, 50) + (entry.prompt.length > 50 ? '...' : '');
  }

  // For entries with a type but no title or prompt
  switch (entry.type) {
    case 'story':
      return 'Story Journey';
    case 'sideQuest':
      return 'Side Quest Adventure';
    case 'action':
      return 'Action Plan';
    case 'summary':
      return 'Daily Summary';
    default:
      return 'Journal Entry';
  }
};
