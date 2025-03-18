
import { JournalEntry } from "@/lib/types";
import { parseContentWithJsonCodeBlock } from "@/services/journal";

interface JournalEntryMetaProps {
  entry: JournalEntry;
  title: string | undefined;
}

export const JournalEntryMeta = ({ entry, title }: JournalEntryMetaProps) => {
  // Parse the entry content to get the actual title or user response
  const getDisplayTitle = () => {
    // If a title is explicitly provided, use that
    if (title) return title;
    
    try {
      // Try to parse the content as JSON
      const parsedContent = parseContentWithJsonCodeBlock(entry.content);
      if (parsedContent && parsedContent.title) {
        return parsedContent.title;
      }
    } catch (e) {
      console.error('Error parsing entry content:', e);
    }
    
    // Fallback to entry.title if parsing fails
    return entry.title;
  };

  // Format the date in a nice way
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">
          {getDisplayTitle()}
        </h1>
        <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
          {entry.type}
        </span>
      </div>
      <p className="text-sm text-jess-muted">
        {formatDate(entry.createdAt)}
      </p>
    </div>
  );
};
