
import React, { useState, useRef, createContext, useContext } from 'react';
import { JournalEntry, User } from '../../lib/types';
import { useJournalEntries } from '../../hooks/journal';
import { useToast } from '@/hooks/use-toast';

interface JournalContextType {
  journalEntries: JournalEntry[];
  isJournalLoading: boolean;
  fetchJournalEntries: () => Promise<JournalEntry[]>;
}

export const JournalContext = createContext<JournalContextType | undefined>(undefined);

interface JournalProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({ user, children }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading } = useJournalEntries();
  const { toast } = useToast();

  const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
    if (!user) return [];
    
    if (isFetchingJournalRef.current) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    
    try {
      console.log("Fetching journal entries for user:", user.id);
      const entries = await fetchEntries(user.id);
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

  // Fetch journal entries when user is loaded and entries haven't been fetched yet
  React.useEffect(() => {
    if (user && !isJournalFetched && !isFetchingJournalRef.current) {
      console.log("Triggering journal entries fetch");
      fetchJournalEntries();
    }
  }, [user, isJournalFetched]);

  const value = {
    journalEntries,
    isJournalLoading: isJournalLoading || journalActionsLoading,
    fetchJournalEntries
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
