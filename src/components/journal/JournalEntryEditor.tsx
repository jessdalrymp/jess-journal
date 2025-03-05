
import { Textarea } from "@/components/ui/textarea";

interface JournalEntryEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const JournalEntryEditor = ({ content, onChange }: JournalEntryEditorProps) => {
  return (
    <Textarea 
      value={content} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[300px] font-mono text-sm"
    />
  );
};
