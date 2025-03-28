
import { JournalEntry } from '@/lib/types';
import { getEntryIcon, getEntryTypeName } from './JournalHistoryUtils';
import { extractFormattedContent } from '@/utils/contentParser';

interface JournalHistoryEntryItemProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
  getEntryTitle: (entry: JournalEntry) => string;
}

export const JournalHistoryEntryItem = ({ 
  entry, 
  onSelect,
  getEntryTitle
}: JournalHistoryEntryItemProps) => {
  // Get clean content focused on user's response rather than prompt
  const summary = extractFormattedContent(entry.content);
  
  return (
    <div
      onClick={() => onSelect(entry)}
      className="p-4 border border-jess-subtle rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium mb-1">{getEntryTitle(entry)}</h3>
          <div className="flex items-center text-sm text-jess-muted mb-2">
            <span className="flex items-center mr-3">
              {getEntryIcon(entry.type)}
              <span className="ml-1">{getEntryTypeName(entry.type)}</span>
            </span>
            <span>
              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {summary && (
            <div className="text-sm line-clamp-3 bg-gray-50 p-2 rounded text-gray-700">
              {summary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
