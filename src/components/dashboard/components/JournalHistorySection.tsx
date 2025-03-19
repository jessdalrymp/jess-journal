
import { useState, useEffect } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { HistorySectionHeading } from './journal/HistorySectionHeading';
import { HistoryActionCard } from './journal/HistoryActionCard';
import { HistoryEntriesList } from './journal/HistoryEntriesList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const JournalHistorySection = () => {
  const { journalEntries, loading, fetchJournalEntries } = useUserData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter and sort recent entries
  const recentEntries = journalEntries 
    ? [...journalEntries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
  
  // Force refresh when the component mounts to ensure latest entries
  useEffect(() => {
    const refreshEntries = async () => {
      console.log("JournalHistorySection - Refreshing entries on mount");
      await fetchJournalEntries();
    };
    
    refreshEntries();
  }, [fetchJournalEntries]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("JournalHistorySection - Manual refresh triggered");
      await fetchJournalEntries();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <HistorySectionHeading />
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
        
        <div className="space-y-3">
          <HistoryActionCard />
          
          {/* Recent Entries - Show actual entries or placeholder */}
          <HistoryEntriesList 
            entries={recentEntries}
            loading={loading || isRefreshing}
          />
        </div>
      </div>
    </div>
  );
};
