
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { JournalEntry } from "../lib/types";
import { useNavigate } from "react-router-dom";
import { deleteJournalEntry } from "@/services/journal";
import { useToast } from "@/hooks/use-toast";
import { EntryList } from "@/components/journal/EntryList";
import { DeleteEntryDialog } from "@/components/journal/DeleteEntryDialog";
import { JournalHistoryHeader } from "@/components/journal/JournalHistoryHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const JournalHistory = () => {
  const { user } = useAuth();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load entries only once when component mounts or when retry is triggered
    const loadEntries = async () => {
      setIsLoading(true);
      if (user) {
        console.log("JournalHistory - Loading journal entries, retry:", retryCount);
        await fetchJournalEntries();
      }
      setIsLoading(false);
    };
    
    loadEntries();
  }, [user, retryCount, fetchJournalEntries]);

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

  const handleRefreshEntries = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Refreshing entries",
      description: "Fetching your latest journal entries",
    });
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
        <div className="flex justify-between items-center mb-6">
          <JournalHistoryHeader onBackClick={() => window.history.back()} />
          <Button 
            onClick={handleRefreshEntries} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
        
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
