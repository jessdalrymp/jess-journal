
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

// Memory cache for journal entries with improved typing
const journalEntriesCache: Record<string, {
  entries: JournalEntry[];
  timestamp: number;
}> = {};

// Increase cache expiration for better performance (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;

/**
 * Hook for fetching journal entries with improved caching and reliability
 */
export function useJournalEntries() {
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();
  const lastFetchTimestamp = useRef<number>(0);

  const clearCache = useCallback((userId?: string) => {
    if (userId) {
      delete journalEntriesCache[userId];
    } else {
      // Clear all cache if no userId provided
      Object.keys(journalEntriesCache).forEach(key => {
        delete journalEntriesCache[key];
      });
    }
    console.log('Journal entries cache cleared');
  }, []);

  const fetchJournalEntries = useCallback(async (userId: string) => {
    // If already fetching, don't start another fetch
    if (isFetching.current) {
      console.log('Already fetching journal entries, skipping duplicate request');
      return journalEntriesCache[userId]?.entries || [];
    }
    
    const now = Date.now();
    
    // Check cache first
    if (journalEntriesCache[userId] && 
        (now - journalEntriesCache[userId].timestamp) < CACHE_EXPIRATION) {
      console.log('Using cached journal entries');
      return journalEntriesCache[userId].entries;
    }
    
    // Ensure we're not fetching too frequently (throttle)
    if (now - lastFetchTimestamp.current < 500) {
      console.log('Throttling journal fetch requests');
      return journalEntriesCache[userId]?.entries || [];
    }
    
    try {
      // Always set loading to true when we start fetching
      setLoading(true);
      isFetching.current = true;
      lastFetchTimestamp.current = now;
      
      console.log('Fetching journal entries for user:', userId);
      
      // Always fetch fresh data from the database
      const entries = await journalService.fetchJournalEntries(userId);
      
      // Update cache with the fresh data
      journalEntriesCache[userId] = {
        entries,
        timestamp: now
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
    clearCache
  };
}
