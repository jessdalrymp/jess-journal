
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
      try {
        await fetchJournalEntries();
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
    try {
      // Sort entries by date (newest first)
      const sorted = [...journalEntries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setSortedEntries(sorted);
    } catch (error) {
      console.error("JournalHistory - Error sorting entries:", error);
      setSortedEntries([...journalEntries]);
    }
  }, [journalEntries]);

  const handleRefreshEntries = () => {
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
