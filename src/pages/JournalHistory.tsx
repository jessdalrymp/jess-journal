
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { JournalEntry } from "../lib/types";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";
import { useNavigate } from "react-router-dom";
import { deleteJournalEntry } from "../services/journalService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const getEntryTitle = (entry: JournalEntry) => {
    try {
      // First check if it's JSON content inside code blocks
      let contentToProcess = entry.content;
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = entry.content.match(jsonRegex);
      if (match && match[1]) {
        contentToProcess = match[1].trim();
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(contentToProcess);
      if (parsed && parsed.title) {
        return parsed.title;
      }
    } catch (e) {
      // Not valid JSON or doesn't have a title, just use the original title
    }
    
    return entry.title;
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </ActionButton>
          <h1 className="text-2xl font-medium">Journal History</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-t-jess-primary border-r-jess-primary border-b-jess-subtle border-l-jess-subtle rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-jess-muted">Loading journal entries...</p>
            </div>
          ) : sortedEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="border border-jess-subtle p-4 rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{getEntryTitle(entry)}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-jess-muted">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-xs px-2 py-1 bg-jess-subtle rounded-full">
                          {entry.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEditClick(e, entry)}
                        className="h-8 w-8"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteClick(e, entry)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-jess-muted mb-2">No journal entries yet</p>
              <p className="text-sm text-jess-muted">Start a conversation to create entries</p>
            </div>
          )}
        </div>
      </main>
      <DisclaimerBanner />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JournalHistory;
