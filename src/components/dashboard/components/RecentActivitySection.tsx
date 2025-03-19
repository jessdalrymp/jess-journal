
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Clock, PenSquare } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getEntryTitle } from '@/components/journal/EntryTitleUtils';
import { parseContentWithJsonCodeBlock } from '@/services/journal/contentParser';

interface RecentActivitySectionProps {
  journalEntries: JournalEntry[];
  isLoading: boolean;
  loading: boolean;
}

// Helper function to extract and format entry content for display
const getEntryPreview = (entry: JournalEntry): string => {
  try {
    // Try to parse JSON content with code blocks
    const parsedContent = parseContentWithJsonCodeBlock(entry.content);
    if (parsedContent && parsedContent.summary) {
      // If we have a parsed summary, use that
      return parsedContent.summary.substring(0, 100) + (parsedContent.summary.length > 100 ? '...' : '');
    }
    
    // For story entries, show content directly
    if (entry.type === 'story') {
      return entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');
    }
    
    // For other types, do basic prompt cleanup
    if (entry.prompt) {
      let userResponse = entry.content;
      // Find where the prompt ends and the user's response begins
      if (userResponse.includes(entry.prompt)) {
        userResponse = userResponse.replace(entry.prompt, '').trim();
      }
      
      return userResponse.substring(0, 100) + (userResponse.length > 100 ? '...' : '');
    }
    
    // Fallback to just the content
    return entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');
  } catch (e) {
    console.error('Error processing entry content:', e);
    return entry.content.substring(0, 100) + '...';
  }
};

export const RecentActivitySection = ({ 
  journalEntries, 
  isLoading, 
  loading 
}: RecentActivitySectionProps) => {
  const navigate = useNavigate();

  // Get recent journal entries safely
  const recentEntries = journalEntries && journalEntries.length > 0
    ? [...journalEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];

  const handleStartJournal = () => {
    navigate('/journal-challenge');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-medium">Recent Activity</h2>
        <Link to="/journal-history" className="text-jess-primary text-sm hover:underline transition-all duration-200">View All</Link>
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
                className="block border border-jess-subtle p-3 rounded-lg hover:bg-jess-subtle/30 transition-all duration-200 hover:border-jess-primary/50 transform hover:-translate-y-0.5"
              >
                <h3 className="font-medium text-sm line-clamp-1">{getEntryTitle(entry)}</h3>
                <div className="text-xs text-jess-muted mt-1">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-jess-foreground mt-1 line-clamp-1 bg-gray-50 p-1 rounded">
                  {getEntryPreview(entry)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-jess-muted mb-4">
              <Clock size={48} className="mx-auto opacity-50" />
            </div>
            <p className="text-jess-foreground font-medium mb-2">Begin your journaling journey</p>
            <p className="text-sm text-jess-muted mb-4">Your journal entries will appear here once you start writing</p>
            <Button 
              onClick={handleStartJournal} 
              className="bg-jess-primary text-white hover:bg-jess-primary/90 inline-flex items-center interactive-button"
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Start Journaling
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
