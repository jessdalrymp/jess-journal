
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface JournalEntryEditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  onTitleChange?: (title: string) => void;
  promptText?: string;
}

export const JournalEntryEditor = ({ 
  content, 
  onChange, 
  title,
  onTitleChange,
  promptText 
}: JournalEntryEditorProps) => {
  // Check if content is a structured JSON entry
  const isJsonContent = content.includes('```json');
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (isJsonContent) {
      // If we have structured JSON content, update it properly
      try {
        const jsonRegex = /```json\s*([\s\S]*?)```/;
        const match = content.match(jsonRegex);
        
        if (match && match[1]) {
          const jsonContent = JSON.parse(match[1].trim());
          
          // Update the summary in the JSON
          jsonContent.summary = newContent;
          
          // If we're also updating title and have a handler
          if (onTitleChange && title !== jsonContent.title) {
            jsonContent.title = title;
          }
          
          // Reconstruct the content with updated JSON
          const updatedContent = `\`\`\`json\n${JSON.stringify(jsonContent, null, 2)}\n\`\`\``;
          onChange(updatedContent);
          return;
        }
      } catch (e) {
        console.error('Error updating JSON content:', e);
      }
    }
    
    // For freewriting entries or if JSON parsing failed, just update content directly
    onChange(newContent);
  };
  
  // Extract the editable content from JSON if needed
  const getEditableContent = (): string => {
    if (isJsonContent) {
      try {
        const jsonRegex = /```json\s*([\s\S]*?)```/;
        const match = content.match(jsonRegex);
        
        if (match && match[1]) {
          const jsonContent = JSON.parse(match[1].trim());
          // Return the summary field for editing
          return jsonContent.summary || '';
        }
      } catch (e) {
        console.error('Error parsing JSON content:', e);
      }
    }
    
    // For freewriting or parsing failures, return the raw content
    return content;
  };

  return (
    <div className="relative">
      {promptText && (
        <div className="mb-4 p-4 bg-jess-subtle rounded-lg">
          <p className="italic text-gray-600">{promptText}</p>
        </div>
      )}
      <Textarea
        value={getEditableContent()}
        onChange={handleContentChange}
        className="min-h-[300px] p-4 text-base"
        placeholder="Start writing your journal entry here..."
      />
    </div>
  );
};
