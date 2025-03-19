import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { getEntryIcon } from '@/components/journal/JournalHistoryUtils';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { parseContentWithJsonCodeBlock } from '@/services/journal/contentParser';

interface HistoryEntryItemProps {
  entry: JournalEntry;
}

// Format the date in a readable way
const formatDate = (date: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Format time from date object
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// Enhanced function to extract and display user's answers rather than prompts
const getEntryContent = (entry: JournalEntry): string => {
  try {
    // First try to parse JSON content
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    if (parsedContent && parsedContent.summary) {
      // If we have a parsed summary, use that
      return parsedContent.summary.substring(0, 100) + '...';
    }
    
    // If there's a prompt, make sure we're only showing the user's response
    if (entry.prompt) {
      let userResponse = entry.content;
      
      // Find where the prompt ends and the user's response begins
      if (userResponse.includes(entry.prompt)) {
        // More aggressive prompt removal to ensure we get just the answer
        userResponse = userResponse.replace(entry.prompt, '').trim();
        
        // If there are any remnants of the question format, try to clean those too
        userResponse = userResponse.replace(/^[\s\n]*[Q|A][:.]?\s*/i, '').trim();
      }
      
      // If user response is still too long after cleaning, truncate it
      return userResponse.substring(0, 100) + (userResponse.length > 100 ? '...' : '');
    }
    
    // For entries without prompt or JSON content, just return a snippet
    return entry.content.substring(0, 100) + '...';
  } catch (e) {
    console.error('Error processing entry content:', e);
    return entry.content.substring(0, 100) + '...';
  }
};

// Attempt to get journal entry type from content
const getEntryType = (entry: JournalEntry): string => {
  try {
    // Check if the content contains JSON
    if (entry.content.includes('"type":')) {
      const match = entry.content.match(/"type"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Default to the entry's type field or "journal"
    return entry.type || 'journal';
  } catch (e) {
    return entry.type || 'journal';
  }
};

export const HistoryEntryItem = ({ entry }: HistoryEntryItemProps) => {
  const entryType = getEntryType(entry);
  
  return (
    <Link 
      key={entry.id} 
      to={`/journal-entry/${entry.id}`}
      className="relative border-l-2 border-jess-subtle pl-4 pb-5 block group"
    >
      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-secondary group-hover:bg-jess-primary transition-colors"></div>
      <div className="flex items-center text-xs text-jess-muted mb-1">
        <Calendar size={12} className="mr-1" />
        <span>{formatDate(new Date(entry.createdAt))}</span>
        <Clock size={12} className="ml-2 mr-1" />
        <span>{formatTime(new Date(entry.createdAt))}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">{getEntryIcon(entryType)}</span>
        <p className="text-sm font-medium text-jess-foreground group-hover:text-jess-primary transition-colors">
          {getEntryTitle(entry)}
        </p>
      </div>
      <div className="mt-1 text-xs text-jess-muted line-clamp-1">
        {getEntryContent(entry)}
      </div>
    </Link>
  );
};
