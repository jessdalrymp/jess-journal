
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { JournalEntry } from "@/lib/types";

/**
 * Hook for handling journal entry interactions like clicking, editing, and deleting
 */
export const useJournalEntryInteractions = () => {
  const navigate = useNavigate();

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
    return entry;
  }, []);

  return {
    handleEntryClick,
    handleEditClick,
    handleDeleteClick
  };
};
