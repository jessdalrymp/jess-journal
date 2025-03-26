
import { useState, useEffect } from "react";
import { useUserData } from "@/context/UserDataContext";
import { JournalEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for managing journal entries data, loading, and sorting
 */
export const useJournalEntryData = () => {
  const { journalEntries, fetchJournalEntries } = useUserData();
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  // Load entries when component mounts or retry count changes
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      console.log("JournalHistory - Loading journal entries, retry count:", retryCount);
      try {
        // Force refresh when loading entries to ensure we get the latest data
        await fetchJournalEntries();
        console.log("JournalHistory - Successfully loaded entries");
      } catch (error) {
        console.error("JournalHistory - Error loading entries:", error);
        toast({
          title: "Error loading entries",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    
    loadEntries();
  }, [retryCount, fetchJournalEntries, toast]);

  // Sort entries whenever journalEntries changes
  useEffect(() => {
    console.log(`JournalHistory - Sorting ${journalEntries.length} entries`);
    
    try {
      // Log raw entries dates for debugging
      if (journalEntries.length > 0) {
        console.log("JournalHistory - Raw entries date range:", {
          newest: new Date(Math.max(...journalEntries.map(e => new Date(e.createdAt).getTime()))).toISOString(),
          oldest: new Date(Math.min(...journalEntries.map(e => new Date(e.createdAt).getTime()))).toISOString()
        });
      }
      
      // Sort entries by date (newest first)
      const sorted = [...journalEntries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`JournalHistory - Sorted ${sorted.length} entries including ${sorted.filter(e => e.conversation_id).length} conversation entries`);
      
      if (sorted.length > 0) {
        // Log the most recent and oldest entries to debug date filtering issues
        console.log("JournalHistory - First entry:", {
          id: sorted[0].id,
          type: sorted[0].type,
          date: new Date(sorted[0].createdAt).toISOString(),
          title: sorted[0].title?.substring(0, 30) + '...',
          conversationId: sorted[0].conversation_id
        });
        
        console.log("JournalHistory - Last entry:", {
          id: sorted[sorted.length - 1].id,
          type: sorted[sorted.length - 1].type,
          date: new Date(sorted[sorted.length - 1].createdAt).toISOString(),
          title: sorted[sorted.length - 1].title?.substring(0, 30) + '...',
          conversationId: sorted[sorted.length - 1].conversation_id
        });
      }
      
      setSortedEntries(sorted);
    } catch (error) {
      console.error("JournalHistory - Error sorting entries:", error);
      setSortedEntries([...journalEntries]);
    }
  }, [journalEntries]);

  const handleRefreshEntries = () => {
    console.log("JournalHistory - Manual refresh triggered");
    setRetryCount(prev => prev + 1);
    toast({
      title: "Refreshing entries",
      description: "Fetching your latest journal entries",
    });
  };

  return {
    sortedEntries,
    isLoading,
    retryCount,
    setRetryCount,
    handleRefreshEntries
  };
};
