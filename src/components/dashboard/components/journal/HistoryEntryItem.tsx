
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { getEntryIcon } from '@/components/journal/JournalHistoryUtils';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { parseEntryContent } from '@/services/journal/contentParser';

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

// Enhanced function to extract and display content from journal entries
const getEntryContent = (entry: JournalEntry): string => {
  try {
    // First try to parse the content as JSON (for conversation summaries)
    const parsedContent = parseEntryContent(entry.content);
    if (parsedContent && parsedContent.summary) {
      // If we have a parsed summary, use that
      return parsedContent.summary.substring(0, 100) + (parsedContent.summary.length > 100 ? '...' : '');
    }
    
    // If there's a prompt, try to separate the question from the answer
    if (entry.prompt) {
      let userResponse = entry.content;
      
      // Try to find where the prompt ends and response begins
      if (userResponse.includes(entry.prompt)) {
        userResponse = userResponse.replace(entry.prompt, '').trim();
      }
      
      // Remove any Q/A format prefixes
      userResponse = userResponse.replace(/^[\s\n]*[Q|A][:.]?\s*/i, '').trim();
      
      return userResponse.substring(0, 100) + (userResponse.length > 100 ? '...' : '');
    }
    
    // Fallback to just showing the first 100 chars of content
    return entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');
  } catch (e) {
    console.error('Error processing entry content:', e);
    return entry.content.substring(0, 100) + '...';
  }
};

export const HistoryEntryItem = ({ entry }: HistoryEntryItemProps) => {
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
        <span className="mr-2">{getEntryIcon(entry.type)}</span>
        <p className="text-sm font-medium text-jess-foreground group-hover:text-jess-primary transition-colors">
          {getEntryTitle(entry)}
        </p>
      </div>
      <div className="mt-1 text-xs text-jess-muted line-clamp-2">
        {getEntryContent(entry)}
      </div>
    </Link>
  );
};
