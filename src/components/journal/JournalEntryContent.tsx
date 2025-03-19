
import { JournalEntry } from "@/lib/types";

interface JournalEntryContentProps {
  entry: JournalEntry;
  parsedContent: { title?: string; summary?: string } | null;
}

export const JournalEntryContent = ({ entry, parsedContent }: JournalEntryContentProps) => {
  // Function to render content with proper formatting for newlines
  const renderContent = () => {
    // If we have parsed JSON content, use the summary
    if (parsedContent && parsedContent.summary) {
      return parsedContent.summary.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4">{paragraph}</p>;
      });
    }
    
    // Remove the prompt from the content if it exists
    let displayContent = entry.content;
    if (entry.prompt && displayContent.includes(entry.prompt)) {
      displayContent = displayContent.replace(entry.prompt, '').trim();
    }
    
    // Render the content with newlines
    return displayContent.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <div className="prose max-w-none">
      {entry.prompt && (
        <div className="bg-jess-subtle rounded-lg p-4 mb-6">
          <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
          <p>{entry.prompt}</p>
        </div>
      )}
      {renderContent()}
    </div>
  );
};
