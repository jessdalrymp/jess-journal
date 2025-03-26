
import { useState, useRef } from 'react';
import { JournalEntry } from '../lib/types';
import { useJournalEntries } from './journal';
import { useToast } from '@/components/ui/use-toast';

export function useJournalContext(userId: string | null | undefined) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading } = useJournalEntries();
  const { toast } = useToast();
  
  const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
    if (!userId) return [];
    
    // Add a min delay between fetches to prevent excessive API calls
    const now = Date.now();
    const minFetchInterval = 1000; // 1 second
    
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
      setJournalEntries(entries);
      setIsJournalFetched(true);
      console.log("Successfully fetched", entries.length, "journal entries");
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
  };

  return {
    journalEntries,
    isJournalFetched,
    setIsJournalFetched,
    isJournalLoading,
    journalActionsLoading,
    fetchJournalEntries
  };
}
