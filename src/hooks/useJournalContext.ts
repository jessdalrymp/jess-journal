
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '../lib/types';
import { useJournalEntries } from './journal';
import { useToast } from '@/components/ui/use-toast';

export function useJournalContext(userId: string | null | undefined) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading, clearCache } = useJournalEntries();
  const { toast } = useToast();
  
  const fetchJournalEntries = useCallback(async (): Promise<JournalEntry[]> => {
    if (!userId) {
      console.log("No user ID provided, cannot fetch journal entries");
      return [];
    }
    
    // Add a min delay between fetches to prevent excessive API calls
    const now = Date.now();
    const minFetchInterval = 500; // half second
    
    if (isFetchingJournalRef.current) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    // If we've fetched recently, skip unless forceFetch is true
    if (now - lastFetchTimeRef.current < minFetchInterval) {
      console.log("Fetch throttled - recent fetch detected");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    lastFetchTimeRef.current = now;
    
    try {
      console.log("Fetching journal entries for user:", userId);
      const entries = await fetchEntries(userId);
      
      if (entries && Array.isArray(entries)) {
        setJournalEntries(entries);
        setIsJournalFetched(true);
        console.log("Successfully fetched", entries.length, "journal entries");
      } else {
        console.warn("Received invalid journal entries data:", entries);
        // Don't update state if data is invalid
      }
      
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return [];
    } finally {
      isFetchingJournalRef.current = false;
      setIsJournalLoading(false);
    }
  }, [userId, journalEntries, fetchEntries, toast]);

  return {
    journalEntries,
    isJournalFetched,
    setIsJournalFetched,
    isJournalLoading,
    journalActionsLoading,
    fetchJournalEntries,
    clearCache
  };
}
