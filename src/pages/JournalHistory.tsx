
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { JournalEntry } from "../lib/types";
import { useNavigate } from "react-router-dom";
import { deleteJournalEntry } from "../services/journalService";
import { useToast } from "@/hooks/use-toast";
import { EntryList } from "@/components/journal/EntryList";
import { DeleteEntryDialog } from "@/components/journal/DeleteEntryDialog";
import { JournalHistoryHeader } from "@/components/journal/JournalHistoryHeader";

const JournalHistory = () => {
  const { user } = useAuth();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load entries only once when component mounts
    const loadEntries = async () => {
      setIsLoading(true);
      if (user) {
        console.log("JournalHistory - Loading journal entries");
        await fetchJournalEntries();
      }
      setIsLoading(false);
    };
    
    loadEntries();
    // Empty dependency array to prevent infinite loop
  }, []);

  useEffect(() => {
    // Sort entries by date (newest first)
    const sorted = [...journalEntries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setSortedEntries(sorted);
    console.log(`JournalHistory - Sorted ${sorted.length} entries`);
  }, [journalEntries]);

  const handleEntryClick = (entry: JournalEntry) => {
    navigate(`/journal-entry/${entry.id}`, { state: { entry } });
  };

  const handleEditClick = (e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    navigate(`/journal-entry/${entry.id}`, { state: { entry, isEditing: true } });
  };

  const handleDeleteClick = (e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    
    const success = await deleteJournalEntry(entryToDelete.id);
    if (success) {
      toast({
        title: "Entry deleted",
        description: "Journal entry has been deleted successfully",
      });
      // Refresh entries list
      if (user) {
        fetchJournalEntries();
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
    }
    
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <JournalHistoryHeader onBackClick={() => window.history.back()} />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <EntryList 
            entries={sortedEntries}
            onEntryClick={handleEntryClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isLoading={isLoading}
          />
        </div>
      </main>
      <DisclaimerBanner />

      <DeleteEntryDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default JournalHistory;
