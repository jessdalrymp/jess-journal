
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import { JournalEntry } from '@/lib/types';
import { getContentPreview } from '@/utils/contentParser';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PenLine, ArrowRight } from 'lucide-react';

export const RecentActivitySection = () => {
  const navigate = useNavigate();
  const { journalEntries, loading: journalLoading } = useUserData();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  
  useEffect(() => {
    if (journalEntries && journalEntries.length > 0) {
      // Get most recent 3 entries
      const sorted = [...journalEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      setRecentEntries(sorted);
    }
  }, [journalEntries]);
  
  const handleViewAllClick = () => {
    navigate('/journal-history');
  };
  
  const handleEntryClick = (entry: JournalEntry) => {
    navigate(`/journal-entry/${entry.id}`);
  };

  if (journalLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-medium">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-jess-primary">
            <span className="mr-2">View All</span>
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="w-2/3 h-5 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-medium">Recent Activity</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <PenLine size={24} className="text-jess-muted mb-2" />
          <p className="text-jess-muted">No recent journal entries</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => navigate('/journal-history', { state: { showJournalChat: true } })}
          >
            Write your first entry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-medium">Recent Activity</h2>
        <Button variant="ghost" size="sm" className="text-jess-primary" onClick={handleViewAllClick}>
          <span className="mr-2">View All</span>
          <ArrowRight size={16} />
        </Button>
      </div>
      <div className="space-y-4">
        {recentEntries.map((entry) => (
          <div 
            key={entry.id} 
            className="flex gap-4 pb-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => handleEntryClick(entry)}
          >
            <div className="w-10 h-10 rounded-full bg-jess-subtle flex items-center justify-center text-jess-primary">
              {getEntryIcon(entry.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-jess-foreground">{entry.title}</h3>
              <p className="text-sm text-jess-muted line-clamp-1">
                {getContentPreview(entry.content, 100)} {/* Fix: Pass entry.content not the whole entry */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
