
import { JournalEntry } from '@/lib/types';
import { getEntryIcon, getEntryTypeName } from './JournalHistoryUtils';
import { parseContentWithJsonCodeBlock } from '@/services/journal/contentParser';

interface JournalHistoryEntryDetailProps {
  entry: JournalEntry;
  getEntryTitle: (entry: JournalEntry) => string;
  onBack: () => void;
}

// Helper function to format the content for display
const formatEntryContent = (entry: JournalEntry): string => {
  try {
    // Try to parse content as JSON
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    if (parsedContent && parsedContent.summary) {
      return parsedContent.summary;
    }
    
    // For story entries, the content might be the summary itself
    if (entry.type === 'story') {
      return entry.content;
    }
    
    // For other entries, return the content as-is
    return entry.content;
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
      
      {entry.type === 'story' ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap mb-4">
          {formattedContent}
        </div>
      ) : (
        <div className="whitespace-pre-wrap">
          {formattedContent}
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
