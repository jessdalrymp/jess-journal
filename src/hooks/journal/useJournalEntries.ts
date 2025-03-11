
import { useState, useRef } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journalService';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for fetching journal entries
 */
export function useJournalEntries() {
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();

  const fetchJournalEntries = async (userId: string) => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      console.log('Already fetching journal entries, skipping duplicate request');
      return [];
    }
    
    try {
      setLoading(true);
      isFetching.current = true;
      console.log('Fetching journal entries for user:', userId);
      const entries = await journalService.fetchJournalEntries(userId);
      console.log(`Successfully fetched ${entries.length} journal entries`);
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  return {
    loading,
    fetchJournalEntries,
  };
}
