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
  const [retryAttempts, setRetryAttempts] = useState(0);
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

  const tryFindingEntry = async () => {
    if (!id) return false;
    
    try {
      console.log(`Retry attempt ${retryAttempts + 1}: Fetching journal entries for entry ${id}`);
      await fetchJournalEntries();
      
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        console.log(`Entry found on retry attempt ${retryAttempts + 1}`);
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
      
      if (location.state?.isEditing) {
        startEditing();
      }

      if (location.state?.entry) {
        setInitialEntry(location.state.entry);
        setEntry(location.state.entry);
        setLoading(false);
        return;
      }
      
      if (id) {
        let foundEntry = journalEntries.find(entry => entry.id === id);
        
        if (!foundEntry) {
          console.log(`Entry with ID ${id} not found in ${journalEntries.length} current entries.`);
          
          try {
            await fetchJournalEntries();
            foundEntry = journalEntries.find(entry => entry.id === id);
          } catch (error) {
            console.error("Error fetching journal entries:", error);
          }
          
          if (!foundEntry && retryAttempts < 3) {
            const delayMs = Math.min(1000 * Math.pow(2, retryAttempts), 5000);
            console.log(`Entry still not found. Retrying in ${delayMs}ms...`);
            
            setTimeout(async () => {
              setRetryAttempts(prev => prev + 1);
              const found = await tryFindingEntry();
              if (!found && retryAttempts >= 2) {
                setNotFound(true);
                setLoading(false);
              }
            }, delayMs);
            
            return;
          }
        }
        
        if (foundEntry) {
          console.log(`Found entry with ID ${id}`);
          setInitialEntry(foundEntry);
          setEntry(foundEntry);
        } else {
          console.log(`Entry with ID ${id} not found after ${retryAttempts} retries.`);
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      
      setLoading(false);
    };

    loadEntry();
  }, [id, location.state, journalEntries, retryAttempts]);

  const handleSaveClick = async () => {
    const success = await handleSave();
    if (success) {
      toast({
        title: "Journal entry saved",
        description: "Your journal entry has been saved successfully.",
      });
      
      navigate('/dashboard');
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
