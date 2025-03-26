
import { useState, useRef, useCallback, useEffect } from 'react';
import { JournalEntry } from '../lib/types';
import { useJournalEntries } from './journal';
import { useToast } from '@/components/ui/use-toast';

export function useJournalContext(userId: string | null | undefined) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const fetchAttemptsRef = useRef(0);
  const lastCacheTimeRef = useRef<number>(0);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading } = useJournalEntries();
  const { toast } = useToast();
  
  // Force a refresh when userId changes or component mounts
  useEffect(() => {
    if (userId) {
      console.log("useJournalContext - userId changed or component mounted, fetching entries");
      fetchJournalEntries(true); // Force refresh on mount
    }
  }, [userId]);
  
  const fetchJournalEntries = useCallback(async (forceFetch = false): Promise<JournalEntry[]> => {
    if (!userId) {
      console.log("useJournalContext - No userId, skipping fetch");
      return [];
    }
    
    // Add a min delay between fetches to prevent excessive API calls
    const now = Date.now();
    const minFetchInterval = 500; // 0.5 second
    
    if (isFetchingJournalRef.current) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    // If we've fetched recently and not forcing a refresh, skip
    if (!forceFetch && now - lastFetchTimeRef.current < minFetchInterval && journalEntries.length > 0) {
      console.log("Fetch throttled - recent fetch detected");
      return journalEntries;
    }
    
    // Initialize fetch state
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    lastFetchTimeRef.current = now;
    fetchAttemptsRef.current += 1;
    
    try {
      console.log("Fetching journal entries for user:", userId);
      console.log("Force fetch:", forceFetch);
      
      const entries = await fetchEntries(userId);
      
      if (entries.length > 0) {
        console.log("Successfully fetched", entries.length, "journal entries");
        
        // Sort entries by date (newest first)
        const sortedEntries = [...entries].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Log date range for debugging
        if (sortedEntries.length > 0) {
          console.log('Sorted entries date range:', {
            newest: new Date(sortedEntries[0].createdAt).toISOString(),
            oldest: new Date(sortedEntries[sortedEntries.length - 1].createdAt).toISOString()
          });
        }
        
        // Log conversation-related entries for debugging
        const conversationEntries = entries.filter(e => e.conversation_id);
        if (conversationEntries.length > 0) {
          console.log(`Found ${conversationEntries.length} entries with conversation_id`);
          console.log('Conversation entries:', conversationEntries.map(e => ({
            id: e.id,
            title: e.title,
            type: e.type,
            createdAt: e.createdAt,
            conversation_id: e.conversation_id
          })));
        }
        
        setJournalEntries(sortedEntries);
        setIsJournalFetched(true);
        lastCacheTimeRef.current = now;
        fetchAttemptsRef.current = 0; // Reset attempts counter on success
        return sortedEntries;
      } else {
        console.log("Fetch returned 0 entries, checking if retry needed");
        // If we've had multiple empty results and know we should have data,
        // show a notification only on the 3rd attempt
        if (fetchAttemptsRef.current >= 3 && isJournalFetched) {
          toast({
            title: "Could not load journal entries",
            description: "Please try refreshing the page",
            variant: "destructive"
          });
        }
        return journalEntries;
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      if (fetchAttemptsRef.current >= 3) {
        toast({
          title: "Error loading journal entries",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      }
      return journalEntries;
    } finally {
      isFetchingJournalRef.current = false;
      setIsJournalLoading(false);
    }
  }, [userId, fetchEntries, journalEntries, isJournalFetched, toast]);

  return {
    journalEntries,
    isJournalFetched,
    setIsJournalFetched,
    isJournalLoading,
    journalActionsLoading,
    fetchJournalEntries
  };
}
