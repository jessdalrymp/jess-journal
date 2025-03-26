
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

// Memory cache for journal entries
const journalEntriesCache: Record<string, {
  entries: JournalEntry[];
  timestamp: number;
  entriesByDate: Record<string, number>;
}> = {};

// Cache expiration time (reduced to 15 seconds to ensure fresh data)
const CACHE_EXPIRATION = 15 * 1000;

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
      // Always log current time to help debug date issues
      console.log('Current time when fetching:', new Date().toISOString());
      
      // Check if we have a valid cache entry and aren't forcing a refresh
      const cachedData = journalEntriesCache[userId];
      if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached journal entries from:', new Date(cachedData.timestamp).toISOString());
        console.log('Cached entries count by date:', cachedData.entriesByDate);
        return cachedData.entries;
      }
      
      setLoading(true);
      isFetching.current = true;
      console.log('Fetching journal entries for user:', userId);
      console.log('Force refresh:', forceRefresh);
      
      // Attempt to fetch entries
      const entries = await journalService.fetchJournalEntries(userId);
      
      console.log(`Fetched ${entries.length} journal entries from service`);
      
      // Process entries to ensure date objects are consistent
      const processedEntries = entries.map(entry => ({
        ...entry,
        createdAt: entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt)
      }));
      
      // Count entries by date for debugging
      const entriesByDate = processedEntries.reduce((acc, entry) => {
        const date = entry.createdAt.toISOString().substring(0, 10);
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Entries by date:', entriesByDate);
      
      // Group by month for higher-level overview
      const entriesByMonth = processedEntries.reduce((acc, entry) => {
        const month = entry.createdAt.toISOString().substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Entries by month:', entriesByMonth);
      
      // Update cache even if we get empty entries (to prevent constant retries)
      journalEntriesCache[userId] = {
        entries: processedEntries,
        timestamp: Date.now(),
        entriesByDate
      };
      
      console.log(`Successfully cached ${processedEntries.length} journal entries at:`, new Date().toISOString());
      return processedEntries;
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
