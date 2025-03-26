
import { useState, useCallback } from "react";
import { JournalEntry } from "@/lib/types";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "@/hooks/use-toast";
import { deleteJournalEntry } from "@/services/journal";

/**
 * Hook for managing journal entry deletion
 */
export const useJournalEntryDelete = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);
  const { user, fetchJournalEntries } = useUserData();
  const { toast } = useToast();

  const handleDeleteClick = useCallback((e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    console.log("JournalHistory - Delete entry dialog:", entry.id, "conversation_id:", entry.conversation_id);
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
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
    deleteDialogOpen,
    setDeleteDialogOpen,
    entryToDelete,
    handleDeleteClick,
    confirmDelete
  };
};
