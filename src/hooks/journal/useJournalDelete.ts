
import { useState } from 'react';
import * as journalService from '@/services/journalService';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for deleting journal entries
 */
export function useJournalDelete() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteJournalEntry = async (entryId: string) => {
    try {
      setLoading(true);
      const success = await journalService.deleteJournalEntry(entryId);
      if (success) {
        toast({
          title: "Journal entry deleted",
          description: "Your entry has been deleted successfully",
        });
      }
      return success;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Error deleting journal entry",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteJournalEntry,
  };
}
