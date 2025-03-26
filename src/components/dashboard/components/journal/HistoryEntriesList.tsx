import React from 'react';
import { JournalEntry } from '@/lib/types';
import { HistoryEntryItem } from './HistoryEntryItem';
import { Link } from 'react-router-dom';

interface HistoryEntriesListProps {
  entries: JournalEntry[];
  loading: boolean;
  limit?: number;
}

export const HistoryEntriesList = ({ entries, loading, limit }: HistoryEntriesListProps) => {
  const displayLimit = limit || 5;

  const getEntryLink = (entry: JournalEntry) => {
    if (entry.type === 'story' || entry.type === 'sideQuest' || entry.type === 'action') {
      if (entry.conversationId) {
        return `/${entry.type.toLowerCase()}?conversationId=${entry.conversationId}`;
      }
    }
    return `/journal-entry/${entry.id}`;
  };

  return (
    <div>
      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.slice(0, displayLimit).map((entry) => (
            <Link key={entry.id} to={getEntryLink(entry)}>
              <HistoryEntryItem entry={entry} />
            </Link>
          ))}
        </div>
      )}
      {!loading && entries.length === 0 && (
        <div className="text-gray-500">No entries found.</div>
      )}
      {loading && (
        <div className="text-gray-500">Loading entries...</div>
      )}
    </div>
  );
};
