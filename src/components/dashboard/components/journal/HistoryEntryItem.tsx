
import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, FileText } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { getEntryIcon } from '@/components/journal/JournalHistoryUtils';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { getContentPreview, extractFormattedContent } from '@/utils/contentParser';

interface HistoryEntryItemProps {
  entry: JournalEntry;
}

// Format the date in a readable way compatible with date-fns v3
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

export const HistoryEntryItem = ({ entry }: HistoryEntryItemProps) => {
  const entryType = entry.type || 'journal';
  const isConversationEntry = !!entry.conversation_id;
  const isSummary = entry.type === 'summary';
  
  // Get clean content without the initial prompt
  let contentPreview = extractFormattedContent(entry.content);
  
  // Get a shorter preview for display
  const displayContent = contentPreview.substring(0, 200) + (contentPreview.length > 200 ? '...' : '');
  
  console.log('Rendering entry in history item:', { 
    id: entry.id, 
    title: getEntryTitle(entry), 
    type: entry.type,
    isConversationEntry,
    isSummary,
    conversation_id: entry.conversation_id,
    content: displayContent.substring(0, 50) + (displayContent.length > 50 ? '...' : '')
  });
  
  // Always link to journal entry
  const linkPath = `/journal-entry/${entry.id}`;
  
  return (
    <Link 
      to={linkPath}
      className="relative border-l-2 border-jess-subtle pl-4 pb-5 block group"
    >
      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-secondary group-hover:bg-jess-primary transition-colors"></div>
      <div className="flex items-center text-xs text-jess-muted mb-1">
        <Calendar size={12} className="mr-1" />
        <span>{formatDate(new Date(entry.createdAt))}</span>
        <Clock size={12} className="ml-2 mr-1" />
        <span>{formatTime(new Date(entry.createdAt))}</span>
        {isConversationEntry && (
          <span className="ml-2 inline-flex items-center">
            <MessageSquare size={12} className="mr-1 text-blue-500" />
            <span className="text-blue-500">Conversation</span>
          </span>
        )}
        {isSummary && (
          <span className="ml-2 inline-flex items-center">
            <FileText size={12} className="mr-1 text-green-500" />
            <span className="text-green-500">Summary</span>
          </span>
        )}
      </div>
      <div className="flex items-center">
        <span className="mr-2">{getEntryIcon(entryType)}</span>
        <p className="text-sm font-medium text-jess-foreground group-hover:text-jess-primary transition-colors">
          {getEntryTitle(entry)}
        </p>
      </div>
      <div className="mt-1 text-xs text-jess-muted line-clamp-2 bg-gray-50 p-1.5 rounded">
        {displayContent}
      </div>
    </Link>
  );
};
