import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";

const JournalEntry = () => {
  const location = useLocation();
  const { id } = useParams();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [loading, setLoading] = useState(true);
  const [initialEntry, setInitialEntry] = useState<JournalEntryType | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    const loadEntry = async () => {
      setLoading(true);
      
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
      if (id) {
        if (journalEntries.length === 0) {
          // Fetch entries if needed
          try {
            await fetchJournalEntries();
          } catch (error) {
            console.error("Error fetching journal entries:", error);
            toast({
              title: "Error loading entries",
              description: "Could not load journal entries. Please try again.",
              variant: "destructive",
            });
          }
        }
        
        const foundEntry = journalEntries.find(entry => entry.id === id);
        if (foundEntry) {
          setInitialEntry(foundEntry);
          setEntry(foundEntry);
        } else {
          console.log(`Entry with ID ${id} not found in ${journalEntries.length} entries`);
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      
      setLoading(false);
    };

    loadEntry();
  }, [id, location.state, journalEntries, setEntry, startEditing, fetchJournalEntries, toast]);

  const handleSaveClick = async () => {
    const success = await handleSave();
    if (success) {
      // Don't navigate away, stay on the same page
      // Just update the local state and UI
    }
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
        onSaveClick={handleSaveClick}
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
