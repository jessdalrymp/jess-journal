
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

// Improved function to get user's answer rather than the prompt/question
const getEntryContent = (entry: JournalEntry): string => {
  try {
    // First try to parse JSON content
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    if (parsedContent && parsedContent.summary) {
      // If we have a parsed summary, use that
      return parsedContent.summary.substring(0, 100) + '...';
    }
    
    // If there's a prompt, extract the user's response
    if (entry.prompt) {
      // Remove the prompt from the beginning of the content
      let userResponse = entry.content;
      if (userResponse.includes(entry.prompt)) {
        userResponse = userResponse.replace(entry.prompt, '').trim();
      }
      
      // Return a snippet of the user's response
      return userResponse.substring(0, 100) + '...';
    }
    
    // For entries without prompt or JSON content, just return a snippet
    return entry.content.substring(0, 100) + '...';
  } catch (e) {
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
