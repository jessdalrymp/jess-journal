
import { JournalEntry } from '@/lib/types';
import { getEntryIcon, getEntryTypeName } from './JournalHistoryUtils';
import { extractFormattedContent } from '@/utils/contentParser';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalHistoryEntryDetailProps {
  entry: JournalEntry;
  getEntryTitle: (entry: JournalEntry) => string;
  onBack: () => void;
}

// Helper function to format the content for display
const formatEntryContent = (entry: JournalEntry): string => {
  try {
    // Use the extractFormattedContent utility to handle JSON formatting
    return extractFormattedContent(entry.content);
  } catch (e) {
    console.error('Error parsing entry content:', e);
    return entry.content;
  }
};

export const JournalHistoryEntryDetail = ({
  entry,
  getEntryTitle,
  onBack
}: JournalHistoryEntryDetailProps) => {
  const formattedContent = formatEntryContent(entry);
  const isConversationSummary = !!entry.conversation_id;
  
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
      
      <h1 className="text-xl font-semibold mb-4">{getEntryTitle(entry)}</h1>
      
      {entry.type === 'story' ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap mb-4">
          {formattedContent}
        </div>
      ) : (
        <div className="whitespace-pre-wrap">
          {formattedContent}
        </div>
      )}
      
      {isConversationSummary && (
        <div className="mt-6 mb-6">
          <Link to={`/my-story?conversationId=${entry.conversation_id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <MessageSquare size={16} />
              View Full Conversation
            </Button>
          </Link>
        </div>
      )}
      
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
