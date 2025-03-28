
import { useState } from 'react';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useUserData } from '@/context/UserDataContext';

/**
 * Hook for updating existing journal entries
 */
export function useJournalUpdate() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchJournalEntries } = useUserData();

  const updateJournalEntry = async (entryId: string, content: string, prompt?: string, type?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update journal entries",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate content is not empty
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast({
        title: "Cannot save empty content",
        description: "Please add some content to your journal entry",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setLoading(true);
      const success = await journalService.updateJournalEntry(entryId, content, user.id, prompt, type);
      
      if (success) {
        toast({
          title: "Journal entry updated",
          description: "Your entry has been updated successfully",
        });
        
        // Force refresh journal entries to clear any cache
        console.log('Refreshing journal entries after update');
        // Remove the boolean parameter since fetchJournalEntries doesn't accept parameters
        await fetchJournalEntries();
      } else {
        toast({
          title: "Error updating entry",
          description: "Your changes could not be saved",
          variant: "destructive"
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
