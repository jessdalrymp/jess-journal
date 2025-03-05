
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface JournalEntryEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const JournalEntryEditor = ({ content, onChange }: JournalEntryEditorProps) => {
  const [cleanedContent, setCleanedContent] = useState(content);

  useEffect(() => {
    // Remove triple backticks when displaying in the editor
    const jsonCodeBlockRegex = /^```json\s*([\s\S]*?)```$/;
    const match = content.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      setCleanedContent(match[1].trim());
    } else {
      setCleanedContent(content);
    }
  }, [content]);

  const handleChange = (newValue: string) => {
    // When saving, ensure we're preserving the code block format if needed
    const jsonRegex = /^\s*\{\s*"title".*"summary".*\}\s*$/s;
    
    if (jsonRegex.test(newValue)) {
      // It's valid JSON, so wrap it with code blocks if it wasn't already wrapped
      if (!content.trim().startsWith('```json')) {
        onChange(`\`\`\`json\n${newValue}\n\`\`\``);
      } else {
        // It was already wrapped, so maintain the wrapper
        onChange(`\`\`\`json\n${newValue}\n\`\`\``);
      }
    } else {
      // Not JSON format, pass as is
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
