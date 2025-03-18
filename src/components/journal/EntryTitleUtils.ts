import { JournalEntry } from '@/lib/types';

export const getEntryTitle = (entry: JournalEntry): string => {
  // If there's a title field, use it
  if (entry.title) {
    return entry.title;
  }
  
  // Otherwise, try to extract title from content or use a fallback
  if (entry.content) {
    // Check if content is JSON
    try {
      if (typeof entry.content === 'string' && entry.content.trim().startsWith('{')) {
        const contentObj = JSON.parse(entry.content);
        if (contentObj.title) {
          return contentObj.title;
        }
      }
    } catch (e) {
      // Not JSON, continue with text processing
    }
    
    // If not JSON or no title in JSON, extract first line/sentence
    const content = typeof entry.content === 'string' ? entry.content : '';
    const firstLine = content.split('\n')[0];
    
    // If first line is too long, truncate it
    if (firstLine && firstLine.length > 0) {
      return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
    }
  }
  
  // Fallback based on entry type
  const typeNames = {
    story: 'My Story',
    sideQuest: 'Side Quest',
    action: 'Action Challenge',
    journal: 'Journal Entry',
  };
  
  return typeNames[entry.type as keyof typeof typeNames] || 'Entry';
};
