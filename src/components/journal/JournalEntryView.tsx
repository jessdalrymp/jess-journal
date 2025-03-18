
import { JournalEntry } from "@/lib/types";
import { JournalEntryContent } from "./JournalEntryContent";
import { JournalEntryEditForm } from "./JournalEntryEditForm";
import { JournalEntryMeta } from "./JournalEntryMeta";
import { JournalEntrySaveButton } from "./JournalEntrySaveButton";

interface JournalEntryViewProps {
  entry: JournalEntry;
  parsedContent: { title?: string; summary?: string } | null;
  isEditing: boolean;
  editableTitle: string;
  editableContent: string;
  setEditableTitle: (title: string) => void;
  setEditableContent: (content: string) => void;
  handleSaveClick: () => Promise<void>;
  isSaving: boolean;
}

export const JournalEntryView = ({
  entry,
  parsedContent,
  isEditing,
  editableTitle,
  editableContent,
  setEditableTitle,
  setEditableContent,
  handleSaveClick,
  isSaving
}: JournalEntryViewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <JournalEntryMeta 
        entry={entry} 
        title={isEditing ? editableTitle : parsedContent?.title} 
      />
      
      {isEditing ? (
        <>
          <JournalEntryEditForm
            entry={entry}
            editableContent={editableContent}
            editableTitle={editableTitle}
            setEditableContent={setEditableContent}
            setEditableTitle={setEditableTitle}
          />
          
          <JournalEntrySaveButton 
            onSave={handleSaveClick} 
            isSaving={isSaving} 
          />
        </>
      ) : (
        <JournalEntryContent 
          entry={entry} 
          parsedContent={parsedContent} 
        />
      )}
    </div>
  );
};
