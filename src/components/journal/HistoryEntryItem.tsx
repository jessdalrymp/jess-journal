
import React from 'react';
import { JournalEntry } from '@/lib/types';
import { format } from 'date-fns';
import { Book, MessageSquare, PenLine, FilePlus } from 'lucide-react';

interface HistoryEntryItemProps {
  entry: JournalEntry;
  isSelected?: boolean;
}

export const HistoryEntryItem = ({ entry, isSelected = false }: HistoryEntryItemProps) => {
  // Get the appropriate icon based on entry type
  const getIcon = () => {
    switch (entry.type) {
      case 'story':
        return <Book className="w-5 h-5" />;
      case 'sideQuest':
        return <MessageSquare className="w-5 h-5" />;
      case 'journal':
        return <PenLine className="w-5 h-5" />;
      default:
        return <FilePlus className="w-5 h-5" />;
    }
  };

  // Get the display name for the entry type
  const getTypeLabel = () => {
    switch (entry.type) {
      case 'story':
        return 'My Story';
      case 'sideQuest':
        return 'Side Quest';
      case 'action':
        return 'Action';
      case 'summary':
        return 'Summary';
      case 'journal':
        return 'Journal Entry';
      default:
        return 'Entry';
    }
  };

  // Extract a content preview from the entry content
  const getContentPreview = () => {
    if (!entry.content) return '';
    
    // Remove any markdown formatting for cleaner preview
    const cleanContent = entry.content
      .replace(/#{1,6}\s+/g, '') // Remove headings
      .replace(/\*\*|\*|__|\n\s*\n/g, ' ') // Remove bold, italic, and extra newlines
      .trim();
    
    // Return a short preview of the content
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + '...' 
      : cleanContent;
  };

  return (
    <div className={`p-4 rounded-lg border ${isSelected 
      ? 'border-jess-primary bg-jess-subtle/20' 
      : 'border-jess-subtle/50 hover:border-jess-primary/50'} transition-colors`}>
      <div className="flex items-start gap-4">
        <div className="text-jess-primary mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-jess-foreground truncate">
              {entry.title || getTypeLabel()}
            </h3>
            <span className="text-sm text-jess-muted whitespace-nowrap">
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="mt-1 text-sm text-jess-muted line-clamp-2">
            {getContentPreview()}
          </p>
        </div>
      </div>
    </div>
  );
};
