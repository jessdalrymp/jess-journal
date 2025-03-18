
import { JournalEntry } from '@/lib/types';
import { getEntryIcon, getEntryTypeName } from './JournalHistoryUtils';

interface JournalHistoryEntryDetailProps {
  entry: JournalEntry;
  getEntryTitle: (entry: JournalEntry) => string;
  onBack: () => void;
}

export const JournalHistoryEntryDetail = ({
  entry,
  getEntryTitle,
  onBack
}: JournalHistoryEntryDetailProps) => {
  return (
    <div>
      <div className="flex items-center text-sm text-jess-muted mb-4">
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
      
      <div className="whitespace-pre-wrap">
        {entry.content}
      </div>
      
      <div className="mt-6">
        <button
          onClick={onBack}
          className="text-sm py-1 px-3 bg-transparent text-jess-foreground hover:bg-jess-subtle/50 rounded-full"
        >
          Back to list
        </button>
      </div>
    </div>
  );
};
