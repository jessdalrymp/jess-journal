import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";
import { JournalEntryHeader } from "@/components/journal/JournalEntryHeader";
import { JournalEntryContent } from "@/components/journal/JournalEntryContent";
import { JournalEntryLayout } from "@/components/journal/JournalEntryLayout";
import { JournalEntryLoading } from "@/components/journal/JournalEntryLoading";
import { JournalEntryNotFound } from "@/components/journal/JournalEntryNotFound";
import { JournalEntryMeta } from "@/components/journal/JournalEntryMeta";
import { JournalEntryEditForm } from "@/components/journal/JournalEntryEditForm";
import { useJournalEntryEditor } from "@/hooks/useJournalEntryEditor";

const JournalEntry = () => {
  const location = useLocation();
  const { id } = useParams();
  const { journalEntries } = useUserData();
  const [loading, setLoading] = useState(true);
  const [initialEntry, setInitialEntry] = useState<JournalEntryType | null>(null);
  
  const {
    entry,
    setEntry,
    parsedContent,
    isEditing,
    editableContent,
    editableTitle,
    setEditableContent,
    setEditableTitle,
    handleSave,
    handleCancelEdit,
    startEditing,
  } = useJournalEntryEditor(initialEntry);

  useEffect(() => {
    // Check if editing mode was passed via state
    if (location.state?.isEditing) {
      startEditing();
    }

    // First check if entry was passed via location state
    if (location.state?.entry) {
      setInitialEntry(location.state.entry);
      setEntry(location.state.entry);
      setLoading(false);
      return;
    }
    
    // Otherwise, find by ID
    if (id && journalEntries.length > 0) {
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setInitialEntry(foundEntry);
        setEntry(foundEntry);
      }
      setLoading(false);
    }
  }, [id, location.state, journalEntries, setEntry, startEditing]);

  if (loading) {
    return <JournalEntryLoading />;
  }

  if (!entry) {
    return <JournalEntryNotFound />;
  }

  return (
    <JournalEntryLayout>
      <JournalEntryHeader 
        isEditing={isEditing}
        onEditClick={startEditing}
        onSaveClick={handleSave}
        onCancelEdit={handleCancelEdit}
      />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <JournalEntryMeta 
          entry={entry} 
          title={isEditing ? editableTitle : parsedContent?.title} 
        />
        
        {isEditing ? (
          <JournalEntryEditForm
            entry={entry}
            editableContent={editableContent}
            editableTitle={editableTitle}
            setEditableContent={setEditableContent}
            setEditableTitle={setEditableTitle}
          />
        ) : (
          <JournalEntryContent 
            entry={entry} 
            parsedContent={parsedContent} 
          />
        )}
      </div>
    </JournalEntryLayout>
  );
};

export default JournalEntry;
