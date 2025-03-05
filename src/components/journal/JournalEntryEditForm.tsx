
import { JournalEntry } from "@/lib/types";
import { JournalEntryEditor } from "./JournalEntryEditor";

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
  return (
    <>
      <input 
        type="text"
        value={editableTitle}
        onChange={(e) => setEditableTitle(e.target.value)}
        className="text-2xl font-semibold border-none px-0 py-0 mb-4 w-full focus-visible:outline-none"
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
