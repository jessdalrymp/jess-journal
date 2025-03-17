
import { useState } from 'react';
import * as journalService from '@/services/journalService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook for updating existing journal entries
 */
export function useJournalUpdate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateJournalEntry = async (entryId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update journal entries",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      const success = await journalService.updateJournalEntry(entryId, content, user.id);
      if (success) {
        toast({
          title: "Journal entry updated",
          description: "Your entry has been updated successfully",
        });
      }
      return success;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast({
        title: "Error updating journal entry",
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
    updateJournalEntry,
  };
}
