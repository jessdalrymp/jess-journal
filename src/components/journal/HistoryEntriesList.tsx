
import React from 'react';
import { JournalEntry } from '@/lib/types';
import { HistoryEntryItem } from '@/components/journal/HistoryEntryItem';
import { Link } from 'react-router-dom';
import { JournalHistorySkeleton } from './JournalHistorySkeleton';

interface HistoryEntriesListProps {
  entries: JournalEntry[];
  loading: boolean;
  limit?: number;
}

export const HistoryEntriesList = ({ entries, loading, limit }: HistoryEntriesListProps) => {
  const displayLimit = limit || entries.length;

  const getEntryLink = (entry: JournalEntry) => {
    if (entry.type === 'story' || entry.type === 'sideQuest' || entry.type === 'action') {
      if (entry.conversationId) {
        return `/${entry.type.toLowerCase()}?conversationId=${entry.conversationId}`;
      }
    }
    return `/journal-entry/${entry.id}`;
  };

  if (loading) {
    return <JournalHistorySkeleton itemCount={displayLimit} />;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-jess-muted">
        <p className="font-medium">No entries found.</p>
        <p className="text-sm mt-2">Start a new conversation or journal entry to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.slice(0, displayLimit).map((entry) => (
        <Link 
          key={entry.id} 
          to={getEntryLink(entry)}
          className="block transition-colors hover:bg-jess-subtle/10 rounded-lg"
        >
          <HistoryEntryItem entry={entry} />
        </Link>
      ))}
    </div>
  );
};
