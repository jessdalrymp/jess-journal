import { useState, useEffect, useCallback } from "react";
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

  // Handle navigation state for journal chat
  useEffect(() => {
    if (location.state?.showJournalChat) {
      console.log("JournalHistory - Showing journal chat from navigation state");
      setShowJournalChat(true);
      if (location.state?.skipPrompt) {
        setSkipPrompt(true);
      }
    }
  }, [location.state]);

  // Load entries when component mounts or retry count changes
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      if (user) {
        console.log("JournalHistory - Loading journal entries, retry count:", retryCount);
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

  // Sort entries whenever journalEntries changes
  useEffect(() => {
    console.log(`JournalHistory - Sorting ${journalEntries.length} entries`);
    
    try {
      // Log raw entries dates for debugging
      if (journalEntries.length > 0) {
        console.log("JournalHistory - Raw entries date range:", {
          newest: new Date(Math.max(...journalEntries.map(e => new Date(e.createdAt).getTime()))).toISOString(),
          oldest: new Date(Math.min(...journalEntries.map(e => new Date(e.createdAt).getTime()))).toISOString()
        });
      }
      
      // Sort entries by date (newest first)
      const sorted = [...journalEntries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`JournalHistory - Sorted ${sorted.length} entries including ${sorted.filter(e => e.conversation_id).length} conversation entries`);
      
      if (sorted.length > 0) {
        // Log the most recent and oldest entries to debug date filtering issues
        console.log("JournalHistory - First entry:", {
          id: sorted[0].id,
          type: sorted[0].type,
          date: new Date(sorted[0].createdAt).toISOString(),
          title: sorted[0].title?.substring(0, 30) + '...',
          conversationId: sorted[0].conversation_id
        });
        
        console.log("JournalHistory - Last entry:", {
          id: sorted[sorted.length - 1].id,
          type: sorted[sorted.length - 1].type,
          date: new Date(sorted[sorted.length - 1].createdAt).toISOString(),
          title: sorted[sorted.length - 1].title?.substring(0, 30) + '...',
          conversationId: sorted[sorted.length - 1].conversation_id
        });
      }
      
      setSortedEntries(sorted);
    } catch (error) {
      console.error("JournalHistory - Error sorting entries:", error);
      setSortedEntries([...journalEntries]);
    }
  }, [journalEntries]);

  const handleEntryClick = useCallback((entry: JournalEntry) => {
    console.log("JournalHistory - Entry clicked:", entry.id, "conversation_id:", entry.conversation_id);
    navigate(`/journal-entry/${entry.id}`, { state: { entry } });
  }, [navigate]);

  const handleEditClick = useCallback((e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    console.log("JournalHistory - Edit entry:", entry.id, "conversation_id:", entry.conversation_id);
    navigate(`/journal-entry/${entry.id}`, { state: { entry, isEditing: true } });
  }, [navigate]);

  const handleDeleteClick = useCallback((e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    console.log("JournalHistory - Delete entry dialog:", entry.id, "conversation_id:", entry.conversation_id);
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  }, []);

  const handleRefreshEntries = useCallback(() => {
    console.log("JournalHistory - Manual refresh triggered");
    setRetryCount(prev => prev + 1);
    toast({
      title: "Refreshing entries",
      description: "Fetching your latest journal entries",
    });
  }, [toast]);

  const handleNewEntry = useCallback(() => {
    console.log("JournalHistory - New entry");
    setShowJournalChat(true);
    setSkipPrompt(false);
  }, []);

  const handleJournalChatBack = useCallback(() => {
    console.log("JournalHistory - Back from chat");
    setShowJournalChat(false);
  }, []);

  const handleJournalChatSave = useCallback(() => {
    console.log("JournalHistory - Chat saved, scheduling refresh");
    setShowJournalChat(false);
    
    // Do an immediate refresh by incrementing retry count
    setRetryCount(prev => prev + 1);
  }, []);

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
        // Force refresh entries after delete by fetching again
        await fetchJournalEntries();
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
