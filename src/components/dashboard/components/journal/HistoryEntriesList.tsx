
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
      setDisplayEntries(entries);
      
      // Log entries for debugging
      console.log(`Rendering ${entries.length} entries in history list`);
      
      // Count conversation summaries
      const summaries = entries.filter(e => e.conversation_id);
      console.log(`Found ${summaries.length} conversation summaries`);
      
      // Log the first few entries with more details
      console.log('First 3 entries details:', entries.slice(0, 3).map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        contentPreview: e.content?.substring(0, 50) + (e.content?.length > 50 ? '...' : ''),
        conversation_id: e.conversation_id,
        createdAt: e.createdAt
      })));
    } else {
      setDisplayEntries([]);
    }
  }, [entries]);
  
  if (loading) {
    return <HistoryLoadingState />;
  }
  
  if (!displayEntries || displayEntries.length === 0) {
    return <HistoryEmptyState />;
  }
  
  return (
    <div className="mt-5 space-y-3 pl-2">
      {displayEntries.map((entry) => (
        <HistoryEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
