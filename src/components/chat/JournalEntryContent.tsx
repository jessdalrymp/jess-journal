
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
    
    // Extract user's response from the content
    const cleanedContent = extractFormattedContent(entry.content);
    
    // Render the content with newlines
    return cleanedContent.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  // Process the prompt to detect and handle JSON content - with special handling for nested JSON
  const renderPrompt = () => {
    if (!entry.prompt) return null;
    
    // Check if the prompt has a JSON block with nested JSON inside
    let promptContent = entry.prompt;
    let jsonData = null;
    
    // Handle case where prompt contains JSON block(s)
    try {
      // Try to find and parse JSON in the prompt
      const jsonRegex = /```json\s*([\s\S]*?)```/g;
      const matches = [...promptContent.matchAll(jsonRegex)];
      
      if (matches.length > 0) {
        // Get the content of the first JSON block
        const jsonString = matches[0][1].trim();
        
        // Clean the JSON string by removing any nested code blocks
        const cleanJsonString = jsonString.replace(/```json\s*|```/g, '');
        
        // Parse the cleaned JSON
        jsonData = JSON.parse(cleanJsonString);
        
        return (
          <div className="bg-jess-subtle rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
            {jsonData.title && (
              <h5 className="font-medium text-jess-primary mb-2">{jsonData.title}</h5>
            )}
            {jsonData.summary && (
              <p className="text-sm">{jsonData.summary}</p>
            )}
          </div>
        );
      }
    } catch (e) {
      console.error('Error processing prompt with JSON:', e);
    }
    
    // If no valid JSON was found or parsing failed, display the prompt as text
    // But clean up any code block markers
    const cleanPrompt = promptContent.replace(/```json\s*|```/g, '').trim();
    
    return (
      <div className="bg-jess-subtle rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium mb-2">Journal Prompt:</h4>
        <p>{cleanPrompt}</p>
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
