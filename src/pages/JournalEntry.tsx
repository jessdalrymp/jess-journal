
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
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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
    isSaving,
  } = useJournalEntryEditor(initialEntry);

  // This function retries fetching journal entries
  const tryFindingEntry = async () => {
    if (!id) return false;
    
    try {
      // Try to refetch entries
      await fetchJournalEntries();
      // Look for the entry again
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setInitialEntry(foundEntry);
        setEntry(foundEntry);
        setNotFound(false);
        return true;
      }
    } catch (error) {
      console.error("Error retrying journal entry fetch:", error);
    }
    return false;
  };

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
        let foundEntry = journalEntries.find(entry => entry.id === id);
        
        // If we didn't find the entry and we have an ID, try fetching again
        if (!foundEntry && journalEntries.length === 0) {
          // Fetch entries if needed
          try {
            await fetchJournalEntries();
            foundEntry = journalEntries.find(entry => entry.id === id);
          } catch (error) {
            console.error("Error fetching journal entries:", error);
            toast({
              title: "Error loading entries",
              description: "Could not load journal entries. Please try again.",
              variant: "destructive",
            });
          }
        }
        
        if (foundEntry) {
          setInitialEntry(foundEntry);
          setEntry(foundEntry);
        } else {
          console.log(`Entry with ID ${id} not found in ${journalEntries.length} entries. Retrying...`);
          
          // Try one more time with a delay
          setTimeout(async () => {
            const found = await tryFindingEntry();
            if (!found) {
              setNotFound(true);
            }
            setLoading(false);
          }, 1000);
          
          return; // Don't set loading to false yet
        }
      } else {
        setNotFound(true);
      }
      
      setLoading(false);
    };

    loadEntry();
  }, [id, location.state, journalEntries.length]);

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
        onCancelEdit={handleCancelEdit}
      />
      
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
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSaveClick} 
                disabled={isSaving}
                className="flex items-center gap-2 bg-jess-primary hover:bg-jess-primary/90"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
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
