import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/hooks/use-toast";
import { JournalEntry } from "@/lib/types";
import { deleteJournalEntry } from "@/services/journal";

export const useJournalHistoryPage = () => {
  const { user } = useAuth();
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [showJournalChat, setShowJournalChat] = useState(false);
  const [skipPrompt, setSkipPrompt] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showJournalChat) {
      setShowJournalChat(true);
      if (location.state?.skipPrompt) {
        setSkipPrompt(true);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      if (user) {
        console.log("JournalHistory - Loading journal entries, retry:", retryCount);
        try {
          await fetchJournalEntries();
          console.log("JournalHistory - Successfully loaded entries");
        } catch (error) {
          console.error("JournalHistory - Error loading entries:", error);
          toast({
            title: "Error loading entries",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };
    
    loadEntries();
  }, [user, retryCount, fetchJournalEntries, toast]);

  useEffect(() => {
    try {
      const sorted = [...journalEntries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`JournalHistory - Sorted ${sorted.length} entries including ${sorted.filter(e => e.conversation_id).length} conversation entries`);
      
      if (sorted.length > 0) {
        console.log("JournalHistory - First 3 entries:", sorted.slice(0, 3).map(e => ({
          id: e.id,
          type: e.type,
          title: e.title?.substring(0, 30) + '...',
          conversationId: e.conversation_id,
          date: e.createdAt
        })));
      }
      
      setSortedEntries(sorted);
    } catch (error) {
      console.error("JournalHistory - Error sorting entries:", error);
      setSortedEntries([...journalEntries]);
    }
  }, [journalEntries]);

  const handleEntryClick = (entry: JournalEntry) => {
    console.log("JournalHistory - Entry clicked:", entry.id);
    navigate(`/journal-entry/${entry.id}`, { state: { entry } });
  };

  const handleEditClick = (e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    console.log("JournalHistory - Edit entry:", entry.id);
    navigate(`/journal-entry/${entry.id}`, { state: { entry, isEditing: true } });
  };

  const handleDeleteClick = (e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    console.log("JournalHistory - Delete entry dialog:", entry.id);
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleRefreshEntries = () => {
    console.log("JournalHistory - Manual refresh triggered");
    setRetryCount(prev => prev + 1);
    toast({
      title: "Refreshing entries",
      description: "Fetching your latest journal entries",
    });
  };

  const handleNewEntry = () => {
    console.log("JournalHistory - New entry");
    setShowJournalChat(true);
    setSkipPrompt(false);
  };

  const handleJournalChatBack = () => {
    console.log("JournalHistory - Back from chat");
    setShowJournalChat(false);
  };

  const handleJournalChatSave = () => {
    console.log("JournalHistory - Chat saved");
    setShowJournalChat(false);
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, 1000);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    
    console.log("JournalHistory - Confirming delete for entry:", entryToDelete.id);
    const success = await deleteJournalEntry(entryToDelete.id);
    if (success) {
      toast({
        title: "Entry deleted",
        description: "Journal entry has been deleted successfully",
      });
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

  return {
    user,
    sortedEntries,
    isLoading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    entryToDelete,
    showJournalChat,
    skipPrompt,
    handleEntryClick,
    handleEditClick,
    handleDeleteClick,
    handleRefreshEntries,
    handleNewEntry,
    handleJournalChatBack,
    handleJournalChatSave,
    confirmDelete
  };
};
