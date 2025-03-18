
import { JournalEntry } from '@/lib/types';
import { getEntryIcon, getEntryTypeName } from './JournalHistoryUtils';
import { getEntryTitle } from './EntryTitleUtils';

interface JournalHistoryEntryItemProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
}

export const JournalHistoryEntryItem = ({ 
  entry, 
  onSelect 
}: JournalHistoryEntryItemProps) => {
  return (
    <div
      onClick={() => onSelect(entry)}
      className="p-4 border border-jess-subtle rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium mb-1">{getEntryTitle(entry)}</h3>
          <div className="flex items-center text-sm text-jess-muted">
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
        </div>
      </div>
    </div>
  );
};
