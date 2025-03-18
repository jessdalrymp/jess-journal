
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Clock, PenSquare } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { parseContentWithJsonCodeBlock } from '@/services/journal';

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

  // Get recent journal entries safely
  const recentEntries = journalEntries && journalEntries.length > 0
    ? [...journalEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];

  // Function to parse the entry content for potential JSON with a title or summary
  const getEntryTitle = (entry: JournalEntry) => {
    try {
      // Parse the content to get the user's answer instead of the question
      const parsedContent = parseContentWithJsonCodeBlock(entry.content);
      
      if (parsedContent) {
        // If we have a summary field (user's answer), use that for the display
        if (parsedContent.summary) {
          // Use the first line or first 50 characters of the summary
          let summaryText = parsedContent.summary.split('\n')[0];
          
          // Replace third-person pronouns with second-person
          summaryText = summaryText
            .replace(/\bthe user\b/gi, "you")
            .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
            .replace(/\btheir\b/gi, "your")
            .replace(/\bthem\b/gi, "you")
            .replace(/\bthemselves\b/gi, "yourself");
          
          return summaryText.length > 50 
            ? summaryText.substring(0, 50) + '...' 
            : summaryText;
        }
        
        // Fallback to title if present
        if (parsedContent.title) {
          // Also personalize the title if possible
          let title = parsedContent.title
            .replace(/\bthe user\b/gi, "you")
            .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
            .replace(/\btheir\b/gi, "your")
            .replace(/\bthem\b/gi, "you")
            .replace(/\bthemselves\b/gi, "yourself");
            
          return title;
        }
      }
    } catch (e) {
      // Not valid JSON or doesn't have the expected fields
    }
    
    return entry.title || "Untitled Entry";
  };

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
