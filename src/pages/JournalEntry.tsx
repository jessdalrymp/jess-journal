import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { JournalEntryHeader } from "@/components/journal/JournalEntryHeader";
import { JournalEntryLayout } from "@/components/journal/JournalEntryLayout";
import { JournalEntryLoading } from "@/components/journal/JournalEntryLoading";
import { JournalEntryNotFound } from "@/components/journal/JournalEntryNotFound";
import { JournalEntryView } from "@/components/journal/JournalEntryView";
import { useJournalEntryEditor } from "@/hooks/useJournalEntryEditor";
import { useJournalEntryLoader } from "@/hooks/useJournalEntryLoader";

const JournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load the journal entry
  const { loading, initialEntry, notFound } = useJournalEntryLoader();

  // Initialize the editor state
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
    isSaving,
  } = useJournalEntryEditor(initialEntry);

  // Start editing if specified in navigation state
  useState(() => {
    if (location.state?.isEditing) {
      startEditing();
    }
  });

  const handleSaveClick = async () => {
    const success = await handleSave();
    if (success) {
      toast({
        title: "Journal entry saved",
        description: "Your journal entry has been saved successfully.",
      });
    }
    return success;
  };

  const handleSaveAndCloseClick = async () => {
    const success = await handleSave();
    if (success) {
      toast({
        title: "Journal entry saved",
        description: "Your journal entry has been saved successfully.",
      });
      navigate('/');
    }
    return success;
  };

  if (loading) {
    return <JournalEntryLoading />;
  }

  if (notFound || !entry) {
    return <JournalEntryNotFound />;
  }

  return (
    <JournalEntryLayout>
      <JournalEntryHeader 
        isEditing={isEditing}
        onEditClick={startEditing}
        onCancelEdit={handleCancelEdit}
      />
      
      <JournalEntryView
        entry={entry}
        parsedContent={parsedContent}
        isEditing={isEditing}
        editableTitle={editableTitle}
        editableContent={editableContent}
        setEditableTitle={setEditableTitle}
        setEditableContent={setEditableContent}
        handleSaveClick={handleSaveClick}
        handleSaveAndCloseClick={handleSaveAndCloseClick}
        isSaving={isSaving}
      />
    </JournalEntryLayout>
  );
};

export default JournalEntry;
