
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

// Memory cache for journal entries
const journalEntriesCache: Record<string, {
  entries: JournalEntry[];
  timestamp: number;
}> = {};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Hook for fetching journal entries with caching
 */
export function useJournalEntries() {
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();

  const fetchJournalEntries = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      console.log('Already fetching journal entries, skipping duplicate request');
      return journalEntriesCache[userId]?.entries || [];
    }
    
    try {
      // Check if we have a valid cache entry
      const cachedData = journalEntriesCache[userId];
      if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached journal entries');
        return cachedData.entries;
      }
      
      setLoading(true);
      isFetching.current = true;
      console.log('Fetching journal entries for user:', userId);
      
      // Attempt to fetch entries
      const entries = await journalService.fetchJournalEntries(userId);
      
      // Update cache even if we get empty entries (to prevent constant retries)
      journalEntriesCache[userId] = {
        entries,
        timestamp: Date.now()
      };
      
      console.log(`Successfully fetched ${entries.length} journal entries`);
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      // Don't show error toast if we have cached entries
      if (!journalEntriesCache[userId] || journalEntriesCache[userId].entries.length === 0) {
        toast({
          title: "Error loading journal entries",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      }
      // Return cached entries if available, otherwise empty array
      return journalEntriesCache[userId]?.entries || [];
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [toast]);

  return {
    loading,
    fetchJournalEntries,
  };
}
