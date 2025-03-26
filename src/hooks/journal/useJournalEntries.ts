
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

// Memory cache for journal entries
const journalEntriesCache: Record<string, {
  entries: JournalEntry[];
  timestamp: number;
}> = {};

// Cache expiration time (30 seconds to ensure we get fresh data frequently)
const CACHE_EXPIRATION = 30 * 1000;

/**
 * Hook for fetching journal entries with caching
 */
export function useJournalEntries() {
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();

  const fetchJournalEntries = useCallback(async (userId: string, forceRefresh = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      console.log('Already fetching journal entries, skipping duplicate request');
      return journalEntriesCache[userId]?.entries || [];
    }
    
    try {
      // Check if we have a valid cache entry and aren't forcing a refresh
      const cachedData = journalEntriesCache[userId];
      const now = Date.now();
      const cacheExpired = !cachedData || (now - cachedData.timestamp) >= CACHE_EXPIRATION;
      
      if (forceRefresh) {
        console.log('Force fetch enabled - bypassing cache');
      } else if (!cacheExpired && cachedData) {
        console.log('Using cached journal entries');
        return cachedData.entries;
      }
      
      setLoading(true);
      isFetching.current = true;
      console.log('Fetching journal entries for user:', userId);
      console.log('Force refresh:', forceRefresh);
      
      // Attempt to fetch entries
      const entries = await journalService.fetchJournalEntries(userId);
      
      console.log(`Successfully fetched ${entries.length} journal entries`);
      
      // Log date range of entries for debugging
      if (entries.length > 0) {
        const dates = entries.map(entry => new Date(entry.createdAt).getTime());
        const newest = new Date(Math.max(...dates));
        const oldest = new Date(Math.min(...dates));
        
        console.log('Sorted entries date range:', {
          newest: newest.toISOString(),
          oldest: oldest.toISOString()
        });
      }
      
      // Update cache even if we get empty entries (to prevent constant retries)
      journalEntriesCache[userId] = {
        entries,
        timestamp: now
      };
      
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
