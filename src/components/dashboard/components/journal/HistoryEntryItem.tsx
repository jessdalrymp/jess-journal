
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { getEntryIcon } from '@/components/journal/JournalHistoryUtils';
import { parseContentWithJsonCodeBlock } from '@/services/journal';

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

// Function to parse the entry content for title or summary
const getEntryTitle = (entry: JournalEntry) => {
  try {
    // Parse the content to get the user's answer instead of the question
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    
    if (parsedContent) {
      // If we have a summary field (user's answer), use that for the display
      if (parsedContent.summary) {
        // Use the first line or first 50 characters of the summary
        let summaryText = parsedContent.summary.split('\n')[0];
        
        // Replace third-person pronouns with second-person
        summaryText = summaryText
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
        
        return summaryText.length > 50 
          ? summaryText.substring(0, 50) + '...' 
          : summaryText;
      }
      
      // Fallback to title if present
      if (parsedContent.title) {
        // Also personalize the title if possible
        let title = parsedContent.title
          .replace(/\bthe user\b/gi, "you")
          .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
          .replace(/\btheir\b/gi, "your")
          .replace(/\bthem\b/gi, "you")
          .replace(/\bthemselves\b/gi, "yourself");
          
        return title;
      }
    }
  } catch (e) {
    // Not valid JSON or doesn't have the expected fields
  }
  
  return entry.title;
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
    </Link>
  );
};
