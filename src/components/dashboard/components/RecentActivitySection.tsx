
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Clock } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { ActionButton } from '@/components/ui/ActionButton';

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
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  // Update recent entries whenever journalEntries change
  useEffect(() => {
    if (journalEntries && journalEntries.length > 0) {
      const sorted = [...journalEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      setRecentEntries(sorted);
    } else {
      setRecentEntries([]);
    }
  }, [journalEntries]);

  // Function to navigate to the blank journal page
  const goToBlankJournal = () => {
    navigate('/blank-journal');
  };

  // Function to parse the entry content for potential JSON with a title
  const getEntryTitle = (entry: JournalEntry) => {
    if (!entry) return "Untitled Entry";
    
    try {
      // First check if it's JSON content inside code blocks
      let contentToProcess = entry.content;
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = entry.content.match(jsonRegex);
      if (match && match[1]) {
        contentToProcess = match[1].trim();
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(contentToProcess);
      if (parsed && parsed.title) {
        return parsed.title;
      }
    } catch (e) {
      // Not valid JSON or doesn't have a title, just use the original title
    }
    
    return entry.title || "Untitled Entry";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium">Recent Activity</h2>
        <div className="flex items-center gap-2">
          <ActionButton 
            onClick={goToBlankJournal} 
            type="secondary"
            className="py-1 px-3 text-sm"
            icon={<FilePlus size={16} />}
          >
            New Entry
          </ActionButton>
          <Link to="/journal-history" className="text-jess-primary text-sm">View All</Link>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[220px]">
        {isLoading || loading ? (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-jess-primary border-r-jess-primary border-b-jess-subtle border-l-jess-subtle rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-jess-muted">Loading your entries...</p>
          </div>
        ) : recentEntries.length > 0 ? (
          <div className="w-full space-y-3">
            {recentEntries.map(entry => (
              <Link 
                key={entry.id} 
                to={`/journal-entry/${entry.id}`}
                className="block border border-jess-subtle p-3 rounded-lg hover:bg-jess-subtle/30 transition-colors"
              >
                <h3 className="font-medium text-sm line-clamp-1">{getEntryTitle(entry)}</h3>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-jess-muted">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs px-2 py-0.5 bg-jess-subtle rounded-full text-jess-muted">
                    {entry.type}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-jess-muted mb-2">
              <Clock size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-jess-muted mb-1">Your journal entries will appear here</p>
            <p className="text-sm text-jess-muted">Start a conversation to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};
