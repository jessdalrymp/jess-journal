
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

interface JournalEntryEditorProps {
  content: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  promptText?: string;
}

export const JournalEntryEditor = ({ 
  content, 
  onChange,
  title,
  onTitleChange,
  promptText
}: JournalEntryEditorProps) => {
  const [cleanedContent, setCleanedContent] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only attempt to parse if we have content
    if (!content || content.trim() === '') {
      setCleanedContent('');
      return;
    }
    
    const jsonCodeBlockRegex = /^```json\s*([\s\S]*?)```$/;
    const match = content.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      try {
        const parsedJson = JSON.parse(match[1].trim());
        
        let formattedContent = '';
        if (parsedJson.summary) {
          formattedContent += parsedJson.summary;
        } else if (parsedJson.content) {
          formattedContent += parsedJson.content;
        }
        
        setCleanedContent(formattedContent);
      } catch (e) {
        // If JSON parsing fails, use the content as is
        console.error('Error parsing JSON in content:', e);
        setCleanedContent(match[1].trim());
      }
    } else {
      // If not in JSON format, use the content directly
      setCleanedContent(content);
    }
  }, [content]);

  const handleChange = (newValue: string) => {
    setCleanedContent(newValue);
    
    try {
      const jsonObj = {
        title: title.trim() || "Untitled Entry",
        summary: newValue.trim()
      };
      
      // Don't include undefined values
      Object.keys(jsonObj).forEach(key => 
        jsonObj[key] === undefined && delete jsonObj[key]
      );
      
      const jsonString = JSON.stringify(jsonObj, null, 2);
      onChange(`\`\`\`json\n${jsonString}\n\`\`\``);
      
      console.log('Content updated to JSON format with title:', title);
    } catch (e) {
      console.error('Error formatting content as JSON:', e);
      onChange(newValue);
    }
  };

  return (
    <div className="w-full space-y-4">
      {promptText && (
        <div className="bg-jess-subtle p-4 rounded-md text-gray-700">
          <p className="font-medium font-sourcesans">Prompt: {promptText}</p>
        </div>
      )}
      
      <Textarea 
        value={cleanedContent} 
        onChange={(e) => handleChange(e.target.value)}
        className="w-full min-h-[300px] font-sourcesans text-sm bg-white"
        placeholder="Write your journal entry here..."
      />
    </div>
  );
};
