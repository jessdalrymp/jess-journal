
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface JournalEntryEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const JournalEntryEditor = ({ content, onChange }: JournalEntryEditorProps) => {
  const [cleanedContent, setCleanedContent] = useState(content);

  useEffect(() => {
    // Remove triple backticks and curly braces when displaying in the editor
    const jsonCodeBlockRegex = /^```json\s*([\s\S]*?)```$/;
    const match = content.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      try {
        // Try to parse the JSON and display its contents directly
        const parsedJson = JSON.parse(match[1].trim());
        
        // Create formatted content from the parsed JSON properties
        let formattedContent = '';
        if (parsedJson.title) {
          formattedContent += `Title: ${parsedJson.title}\n\n`;
        }
        if (parsedJson.summary) {
          formattedContent += `Summary: ${parsedJson.summary}`;
        }
        
        setCleanedContent(formattedContent);
      } catch (e) {
        // If parsing fails, just use the content without code blocks
        setCleanedContent(match[1].trim());
      }
    } else {
      setCleanedContent(content);
    }
  }, [content]);

  const handleChange = (newValue: string) => {
    // When saving, we need to convert the text back to JSON format
    const titleMatch = newValue.match(/Title:\s*(.*?)(?:\n\n|\n(?=Summary:)|$)/s);
    const summaryMatch = newValue.match(/Summary:\s*([\s\S]*?)$/s);
    
    const title = titleMatch ? titleMatch[1].trim() : '';
    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    
    if (title || summary) {
      // Convert back to JSON format
      const jsonObj = {
        title: title || undefined,
        summary: summary || undefined
      };
      
      // Remove undefined properties
      Object.keys(jsonObj).forEach(key => 
        jsonObj[key] === undefined && delete jsonObj[key]
      );
      
      // Format as JSON with code blocks
      const jsonString = JSON.stringify(jsonObj, null, 2);
      onChange(`\`\`\`json\n${jsonString}\n\`\`\``);
    } else {
      // Not in our expected format, pass as is
      onChange(newValue);
    }
  };

  return (
    <Textarea 
      value={cleanedContent} 
      onChange={(e) => handleChange(e.target.value)}
      className="w-full min-h-[300px] font-mono text-sm"
    />
  );
};
