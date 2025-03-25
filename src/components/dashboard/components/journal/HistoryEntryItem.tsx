
import { Link } from 'react-router-dom';
import { JournalEntry } from '@/lib/types';
import { getEntryIcon } from '@/components/journal/JournalHistoryUtils';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { getContentPreview } from '@/utils/contentParser';

interface HistoryEntryItemProps {
  entry: JournalEntry;
}

export const HistoryEntryItem = ({ entry }: HistoryEntryItemProps) => {
  // Get content preview, handling both structured and freewriting entries
  const content = getContentPreview(entry);
  
  // Check if entry is a conversation summary
  const isConversationSummary = !!entry.conversation_id;
  
  // Format dates
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

  // Link to journal entry page
  const linkPath = `/journal-entry/${entry.id}`;
  
  console.log("Rendering entry in history item:", {
    id: entry.id,
    title: getEntryTitle(entry),
    type: entry.type,
    isConversationSummary: isConversationSummary,
    isSummary: entry.content.includes('```json'),
    conversation_id: entry.conversation_id,
    content: content.substring(0, 40) + (content.length > 40 ? '...' : '')
  });
  
  return (
    <Link 
      to={linkPath}
      className="relative border-l-2 border-jess-subtle pl-4 pb-5 block group"
    >
      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-secondary group-hover:bg-jess-primary transition-colors"></div>
      <div className="flex items-center text-xs text-jess-muted mb-1">
        <span>{formatDate(new Date(entry.createdAt))}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">{getEntryIcon(entry.type)}</span>
        <p className="text-sm font-medium text-jess-foreground group-hover:text-jess-primary transition-colors">
          {getEntryTitle(entry)}
        </p>
      </div>
      <div className="mt-1 text-xs text-jess-muted line-clamp-2 bg-gray-50 p-1.5 rounded">
        {content}
      </div>
    </Link>
  );
};
