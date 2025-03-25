
import { JournalEntry } from "@/lib/types";
import { parseEntryContent, convertToSecondPerson } from "@/utils/contentParser";

interface JournalEntryContentProps {
  entry: JournalEntry;
  parsedContent?: { title?: string; summary?: string } | null;
}

export const JournalEntryContent = ({ entry, parsedContent }: JournalEntryContentProps) => {
  // Use provided parsedContent or parse it if not provided
  const contentData = parsedContent || parseEntryContent(entry.content);
  
  // Function to render content with proper formatting for newlines
  const renderContent = () => {
    // If we have parsed JSON content, use the summary
    if (contentData && contentData.summary) {
      // Apply second-person language conversion to the summary
      const formattedSummary = convertToSecondPerson(contentData.summary);
      
      return formattedSummary.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4">{paragraph}</p>;
      });
    }
    
    // Remove the prompt from the content if it exists
    let displayContent = entry.content;
    if (entry.prompt && displayContent.includes(entry.prompt)) {
      // More thorough prompt removal
      displayContent = displayContent.replace(entry.prompt, '').trim();
      
      // Also remove any Q: or A: prefixes that might remain
      displayContent = displayContent.replace(/^[\s\n]*[Q|A][:.]?\s*/im, '').trim();
    }
    
    // Apply second-person language conversion
    displayContent = convertToSecondPerson(displayContent);
    
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
