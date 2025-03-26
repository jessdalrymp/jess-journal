
import { JournalEntry } from '@/lib/types';
import { HistoryEntryItem } from './HistoryEntryItem';
import { HistoryLoadingState } from './HistoryLoadingState';
import { HistoryEmptyState } from './HistoryEmptyState';
import { useEffect, useState } from 'react';

interface HistoryEntriesListProps {
  entries: JournalEntry[];
  loading: boolean;
}

export const HistoryEntriesList = ({ entries, loading }: HistoryEntriesListProps) => {
  const [displayEntries, setDisplayEntries] = useState<JournalEntry[]>([]);
  
  // Update display entries when entries prop changes
  useEffect(() => {
    if (entries && entries.length > 0) {
      console.log(`HistoryEntriesList - Received ${entries.length} entries to display`);
      setDisplayEntries(entries);
    } else {
      console.log('HistoryEntriesList - No entries to display');
      setDisplayEntries([]);
    }
  }, [entries]);
  
  // Show loading state
  if (loading) {
    console.log('HistoryEntriesList - Showing loading state');
    return <HistoryLoadingState />;
  }
  
  // Show empty state if no entries
  if (!displayEntries || displayEntries.length === 0) {
    console.log('HistoryEntriesList - Showing empty state');
    return <HistoryEmptyState />;
  }
  
  // Show entries
  console.log(`HistoryEntriesList - Rendering ${displayEntries.length} entries`);
  return (
    <div className="mt-5 space-y-3 pl-2">
      {displayEntries.map((entry) => (
        <HistoryEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
