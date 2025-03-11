
import { useJournalEntries, useJournalCreate, useJournalUpdate, useJournalDelete } from './journal';

/**
 * Composite hook that provides all journal-related functionality
 */
export function useJournalActions() {
  const { loading: fetchLoading, fetchJournalEntries } = useJournalEntries();
  const { loading: createLoading, saveJournalEntry } = useJournalCreate();
  const { loading: updateLoading, updateJournalEntry } = useJournalUpdate();
  const { loading: deleteLoading, deleteJournalEntry } = useJournalDelete();

  // Combine loading states
  const loading = fetchLoading || createLoading || updateLoading || deleteLoading;

  return {
    loading,
    fetchJournalEntries,
    saveJournalEntry,
    updateJournalEntry,
    deleteJournalEntry
  };
}
