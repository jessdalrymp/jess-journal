
import { useUserData } from '@/context/UserDataContext';
import { HistorySectionHeading } from './journal/HistorySectionHeading';
import { HistoryActionCard } from './journal/HistoryActionCard';
import { HistoryEntriesList } from './journal/HistoryEntriesList';

export const JournalHistorySection = () => {
  const { journalEntries, loading } = useUserData();
  
  // Filter and sort recent entries
  const recentEntries = journalEntries 
    ? [...journalEntries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <HistorySectionHeading />
        
        <div className="space-y-3">
          <HistoryActionCard />
          
          {/* Recent Entries - Show actual entries or placeholder */}
          <HistoryEntriesList 
            entries={recentEntries}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
