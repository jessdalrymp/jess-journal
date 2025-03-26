import React from 'react';
import { JournalEntry } from '@/lib/types';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

interface JournalHistoryEntryDetailProps {
  entry: JournalEntry;
}

export const JournalHistoryEntryDetail = ({ entry }: JournalHistoryEntryDetailProps) => {
  const getEntryLink = () => {
    if (entry.type === 'story' || entry.type === 'sideQuest' || entry.type === 'action') {
      if (entry.conversationId) {
        return `/${entry.type.toLowerCase()}?conversationId=${entry.conversationId}`;
      }
    }
    return `/journal-entry/${entry.id}`;
  };

  return (
    <div>
      {entry.conversationId && (
        <div className="mt-4">
          <Link 
            to={getEntryLink()} 
            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Continue conversation
          </Link>
        </div>
      )}
    </div>
  );
};
