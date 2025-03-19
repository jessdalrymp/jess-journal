
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Clock, PenSquare } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { getContentPreview } from '@/utils/contentParser';

interface RecentActivitySectionProps {
  journalEntries: JournalEntry[];
  isLoading: boolean;
  loading: boolean;
}

export const RecentActivitySection = ({ 
  journalEntries, 
  isLoading, 
  loading 
}: RecentActivitySectionProps) => {
  const navigate = useNavigate();

  // Get recent journal entries safely, including entries from conversations
  const recentEntries = journalEntries && journalEntries.length > 0
    ? [...journalEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];

  // Debug logs to check what entries are available
  console.log('Recent activity entries:', recentEntries);
  console.log('Total journal entries:', journalEntries?.length);
  console.log('Entries with conversation_id:', journalEntries?.filter(e => e.conversation_id)?.length);

  const handleStartJournal = () => {
    navigate('/journal-challenge');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-medium">Recent Activity</h2>
        <Link to="/journal-history" className="text-jess-primary text-base hover:underline transition-all duration-200">View All</Link>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1">
        {isLoading || loading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-jess-primary border-r-jess-primary border-b-jess-subtle border-l-jess-subtle rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-jess-muted text-base">Loading your entries...</p>
          </div>
        ) : recentEntries.length > 0 ? (
          <div className="w-full space-y-4">
            {recentEntries.map(entry => (
              <Link 
                key={entry.id} 
                to={`/journal-entry/${entry.id}`}
                className="block border border-jess-subtle p-4 rounded-lg hover:bg-jess-subtle/30 transition-all duration-200 hover:border-jess-primary/50 transform hover:-translate-y-0.5"
              >
                <h3 className="font-medium text-base line-clamp-1">{getEntryTitle(entry)}</h3>
                <div className="text-sm text-jess-muted mt-1.5 flex justify-between">
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <span className="bg-jess-subtle/50 px-2 py-0.5 rounded text-sm">{entry.type}</span>
                </div>
                <div className="mt-2 text-sm line-clamp-2 bg-gray-50 p-2 rounded">
                  {getContentPreview(entry)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-jess-muted mb-4">
              <Clock size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-jess-foreground font-medium mb-2 text-lg">Begin your journaling journey</p>
            <p className="text-base text-jess-muted mb-4">Your journal entries will appear here once you start writing</p>
            <Button 
              onClick={handleStartJournal} 
              className="bg-jess-primary text-white hover:bg-jess-primary/90 inline-flex items-center interactive-button text-base px-5 py-2"
            >
              <PenSquare className="mr-2 h-5 w-5" />
              Start Journaling
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
