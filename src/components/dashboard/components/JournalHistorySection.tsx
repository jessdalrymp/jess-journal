
import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { HistorySectionHeading } from './journal/HistorySectionHeading';
import { HistoryActionCard } from './journal/HistoryActionCard';
import { HistoryEntriesList } from './journal/HistoryEntriesList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { HistoryViewAllLink } from './journal/HistoryViewAllLink';
import { useNavigate } from 'react-router-dom';

export const JournalHistorySection = () => {
  const { journalEntries, loading, fetchJournalEntries } = useUserData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mountedTime] = useState(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter and sort recent entries
  const recentEntries = journalEntries 
    ? [...journalEntries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
  
  // Refresh only on mount
  const refreshEntries = useCallback(async () => {
    try {
      console.log("JournalHistorySection - Refreshing entries");
      await fetchJournalEntries();
    } catch (error) {
      console.error("Error refreshing journal entries:", error);
    }
  }, [fetchJournalEntries]);
  
  // Refresh on mount
  useEffect(() => {
    console.log("JournalHistorySection - Component mounted, refreshing entries");
    refreshEntries();
  }, []); // Only run once on mount
  
  // No additional delayed refresh
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("JournalHistorySection - Manual refresh triggered");
      await fetchJournalEntries();
      toast({
        title: "Refreshed",
        description: "Your journal entries have been refreshed",
        duration: 2000
      });
    } catch (error) {
      console.error("Error refreshing journal entries:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh journal entries. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNewJournal = () => {
    navigate('/journal-history', { state: { showJournalChat: true } });
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-medium">Journal History</h2>
        <div className="flex items-center gap-3">
          <HistoryViewAllLink />
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm"
            disabled={loading || isRefreshing}
            className="text-jess-primary hover:text-jess-primary/80"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin mr-2" : "mr-2"} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1">
        <HistoryActionCard />
        
        {/* Recent Entries - Show actual entries or placeholder */}
        <HistoryEntriesList 
          entries={recentEntries}
          loading={loading || isRefreshing}
        />
      </div>
    </div>
  );
};
