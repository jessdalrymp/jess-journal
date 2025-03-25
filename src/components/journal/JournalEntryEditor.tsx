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
    const jsonCodeBlockRegex = /^```json\s*([\s\S]*?)```$/;
    const match = content.match(jsonCodeBlockRegex);
    
    if (match && match[1]) {
      try {
        const parsedJson = JSON.parse(match[1].trim());
        
        let formattedContent = '';
        if (parsedJson.summary) {
          formattedContent += parsedJson.summary;
        }
        
        setCleanedContent(formattedContent);
      } catch (e) {
        setCleanedContent(match[1].trim());
      }
    } else {
      setCleanedContent(content);
    }
  }, [content]);

  const handleChange = (newValue: string) => {
    setCleanedContent(newValue);
    
    try {
      const jsonObj = {
        title: title,
        summary: newValue.trim()
      };
      
      Object.keys(jsonObj).forEach(key => 
        jsonObj[key] === undefined && delete jsonObj[key]
      );
      
      const jsonString = JSON.stringify(jsonObj, null, 2);
      onChange(`\`\`\`json\n${jsonString}\n\`\`\``);
    } catch (e) {
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
