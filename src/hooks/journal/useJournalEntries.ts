
import { useState, useRef, useCallback } from 'react';
import { JournalEntry } from '@/lib/types';
import * as journalService from '@/services/journal';
import { useToast } from '@/components/ui/use-toast';

// Memory cache for journal entries
const journalEntriesCache: Record<string, {
  entries: JournalEntry[];
  timestamp: number;
}> = {};

// Cache expiration time (2 minutes - shortened to ensure fresher data)
const CACHE_EXPIRATION = 2 * 60 * 1000;

/**
 * Hook for fetching journal entries with improved error handling
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
      setLoading(true);
      isFetching.current = true;
      
      // Check if we have a valid cache entry
      const cachedData = journalEntriesCache[userId];
      const now = Date.now();
      const useCache = cachedData && (now - cachedData.timestamp) < CACHE_EXPIRATION;
      
      if (useCache) {
        console.log('Using cached journal entries');
        setLoading(false);
        return cachedData.entries;
      }
      
      console.log('Fetching journal entries for user:', userId);
      
      // Attempt to fetch entries
      const entries = await journalService.fetchJournalEntries(userId);
      
      console.log(`Successfully fetched ${entries.length} journal entries`);
      
      // Always update cache with latest data
      journalEntriesCache[userId] = {
        entries,
        timestamp: now
      };
      
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      
      // Show error toast
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      
      // Return cached entries if available, otherwise empty array
      return journalEntriesCache[userId]?.entries || [];
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [toast]);

  // Force refresh method to bypass cache
  const forceRefreshEntries = useCallback(async (userId: string) => {
    if (!userId) return [];
    
    // Delete cache entry to force fresh fetch
    delete journalEntriesCache[userId];
    
    try {
      setLoading(true);
      isFetching.current = true;
      
      console.log('Force refreshing journal entries for user:', userId);
      const entries = await journalService.fetchJournalEntries(userId);
      
      // Update cache with fresh data
      journalEntriesCache[userId] = {
        entries,
        timestamp: Date.now()
      };
      
      console.log(`Successfully refreshed ${entries.length} journal entries`);
      return entries;
    } catch (error) {
      console.error('Error force refreshing journal entries:', error);
      toast({
        title: "Error refreshing journal entries",
        description: "Please try again later",
        variant: "destructive"
      });
      return journalEntriesCache[userId]?.entries || [];
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [toast]);

  return {
    loading,
    fetchJournalEntries,
    forceRefreshEntries
  };
}
