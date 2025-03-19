
import { JournalEntry } from '@/lib/types';
import { HistoryEntryItem } from './HistoryEntryItem';
import { HistoryLoadingState } from './HistoryLoadingState';
import { HistoryEmptyState } from './HistoryEmptyState';
import { useEffect } from 'react';

interface HistoryEntriesListProps {
  entries: JournalEntry[];
  loading: boolean;
}

export const HistoryEntriesList = ({ entries, loading }: HistoryEntriesListProps) => {
  // Log entries for debugging
  useEffect(() => {
    if (entries.length > 0) {
      console.log(`Rendering ${entries.length} entries in history list`);
      console.log('First 3 entries:', entries.slice(0, 3).map(e => ({
        id: e.id,
        title: e.title,
        type: e.type,
        conversation_id: e.conversation_id,
        has_content: !!e.content
      })));
      
      // Check for conversation summaries
      const summaries = entries.filter(e => e.conversation_id);
      console.log(`Found ${summaries.length} conversation summaries`);
    }
  }, [entries]);
  
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
