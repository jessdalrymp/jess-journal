
import { JournalEntry } from '@/lib/types';
import { HistoryEntryItem } from './HistoryEntryItem';
import { HistoryLoadingState } from './HistoryLoadingState';
import { HistoryEmptyState } from './HistoryEmptyState';

interface HistoryEntriesListProps {
  entries: JournalEntry[];
  loading: boolean;
}

export const HistoryEntriesList = ({ entries, loading }: HistoryEntriesListProps) => {
  if (loading) {
    return <HistoryLoadingState />;
  }
  
  if (entries.length === 0) {
    return <HistoryEmptyState />;
  }
  
  return (
    <div className="mt-5 space-y-3 pl-2">
      {entries.map((entry) => (
        <HistoryEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
