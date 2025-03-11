
import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journalService';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for creating new journal entries
 */
export function useJournalCreate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveJournalEntry = async (userId: string, prompt: string, content: string) => {
    try {
      setLoading(true);
      const entry = await journalService.saveJournalEntry(userId, prompt, content);
      if (entry) {
        toast({
          title: "Journal entry saved",
          description: "Your entry has been saved successfully",
        });
      }
      return entry;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving journal entry",
        description: "Please try again later",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveJournalEntry,
  };
}
