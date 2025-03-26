
import { useAuth } from "@/context/AuthContext";
import { useJournalEntryData } from "./journal/useJournalEntryData";
import { useJournalEntryInteractions } from "./journal/useJournalEntryInteractions";
import { useJournalChatState } from "./journal/useJournalChatState";
import { useJournalEntryDelete } from "./journal/useJournalEntryDelete";
import { JournalEntry } from "@/lib/types";

/**
 * Main hook for the Journal History page that combines all journal-related hooks
 */
export const useJournalHistoryPage = () => {
  const { user } = useAuth();
  const { 
    sortedEntries, 
    isLoading, 
    setRetryCount, 
    handleRefreshEntries 
  } = useJournalEntryData();
  
  const { 
    showJournalChat, 
    skipPrompt, 
    handleNewEntry, 
    handleJournalChatBack, 
    handleJournalChatSave 
  } = useJournalChatState(setRetryCount);
  
  const { 
    handleEntryClick, 
    handleEditClick 
  } = useJournalEntryInteractions();
  
  const { 
    deleteDialogOpen, 
    setDeleteDialogOpen, 
    entryToDelete, 
    handleDeleteClick, 
    confirmDelete 
  } = useJournalEntryDelete();

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
