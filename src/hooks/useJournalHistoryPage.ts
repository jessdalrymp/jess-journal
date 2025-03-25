
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

  // Check location state for any parameters passed
  useEffect(() => {
    if (location.state?.showJournalChat) {
      setShowJournalChat(true);
      if (location.state?.skipPrompt) {
        setSkipPrompt(true);
      }
    }
  }, [location.state]);

  // Load journal entries when user is available or when retry is triggered
  useEffect(() => {
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

  // Sort entries by date (newest first)
  useEffect(() => {
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

  const handleNewEntry = () => {
    setShowJournalChat(true);
    setSkipPrompt(false);
  };

  const handleWriteFreely = () => {
    setShowJournalChat(true);
    setSkipPrompt(true);
  };

  const handleJournalChatBack = () => {
    setShowJournalChat(false);
  };

  const handleJournalChatSave = () => {
    setShowJournalChat(false);
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, 1000);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    
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
    handleWriteFreely,
    handleJournalChatBack,
    handleJournalChatSave,
    confirmDelete
  };
};
