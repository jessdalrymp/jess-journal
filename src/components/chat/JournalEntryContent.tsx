
import { JournalEntry } from "@/lib/types";
import { parseEntryContent, extractFormattedContent } from "@/utils/contentParser";

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
      return contentData.summary.split('\n').map((paragraph, index) => {
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
    
    // Clean up any JSON code blocks in the content
    const cleanedContent = extractFormattedContent(displayContent);
    
    // Render the content with newlines
    return cleanedContent.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  // Process the prompt to detect and handle JSON content
  const renderPrompt = () => {
    if (!entry.prompt) return null;
    
    // Check if the prompt contains JSON
    const jsonMatch = entry.prompt.match(/```json\s*([\s\S]*?)```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        // Try to parse the JSON
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        
        return (
          <div className="bg-jess-subtle rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
            {parsedJson.title && (
              <h5 className="font-medium text-jess-primary mb-2">{parsedJson.title}</h5>
            )}
            {parsedJson.summary && (
              <p className="text-sm">{parsedJson.summary}</p>
            )}
          </div>
        );
      } catch (e) {
        // If parsing fails, just display the prompt as text
        return (
          <div className="bg-jess-subtle rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
            <p>{entry.prompt.replace(/```json|```/g, '')}</p>
          </div>
        );
      }
    }
    
    // Regular prompt without JSON
    return (
      <div className="bg-jess-subtle rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
        <p>{entry.prompt}</p>
      </div>
    );
  };

  return (
    <div className="prose max-w-none">
      {entry.prompt && renderPrompt()}
      {renderContent()}
    </div>
  );
};
