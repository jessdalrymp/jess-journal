
import { JournalEntry } from "@/lib/types";
import { JournalEntryEditor } from "./JournalEntryEditor";
import { useIsMobile } from "@/hooks/use-mobile";

interface JournalEntryEditFormProps {
  entry: JournalEntry;
  editableContent: string;
  editableTitle: string;
  setEditableContent: (content: string) => void;
  setEditableTitle: (title: string) => void;
}

export const JournalEntryEditForm: React.FC<JournalEntryEditFormProps> = ({
  editableContent,
  editableTitle,
  setEditableContent,
  setEditableTitle,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <input 
        type="text"
        value={editableTitle}
        onChange={(e) => setEditableTitle(e.target.value)}
        className="text-2xl font-semibold border-none mb-4 w-full focus-visible:outline-none bg-jess-subtle rounded-md px-2 py-1"
        placeholder="Enter title..."
      />
      <JournalEntryEditor 
        content={editableContent} 
        onChange={setEditableContent}
        title={editableTitle}
        onTitleChange={setEditableTitle} 
      />
    </>
  );
};
