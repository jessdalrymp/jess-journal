
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { Book, MessageSquare, Lightbulb, PenLine, Clock, History, User, ArrowRight, FilePlus } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const { profile, journalEntries, fetchJournalEntries, loading } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          console.log("Dashboard - Loading journal entries for user:", user.id);
          await fetchJournalEntries();
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, fetchJournalEntries]);

  // Get recent journal entries safely
  const recentEntries = [...(journalEntries || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Function to parse the entry content for potential JSON with a title
  const getEntryTitle = (entry) => {
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

  // Function to navigate to the blank journal page
  const goToBlankJournal = () => {
    navigate('/blank-journal');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Actions Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-5">Core Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/my-story">
              <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
                <div className="text-jess-primary mb-3">
                  <Book size={24} />
                </div>
                <h3 className="text-center">My Story</h3>
              </div>
            </Link>
            
            <Link to="/side-quest">
              <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
                <div className="text-jess-primary mb-3">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-center">Side Quest</h3>
              </div>
            </Link>
            
            <Link to="/action-challenge">
              <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
                <div className="text-jess-primary mb-3">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-center">Action Challenge</h3>
              </div>
            </Link>
            
            <Link to="/journal-challenge">
              <div className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all">
                <div className="text-jess-primary mb-3">
                  <PenLine size={24} />
                </div>
                <h3 className="text-center">Journal Challenge</h3>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
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
                    <div className="text-xs text-jess-muted mt-1">
                      {new Date(entry.createdAt).toLocaleDateString()}
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
        
        {/* Journal History Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-medium">Journal History</h2>
            <Link to="/journal-history" className="text-jess-primary text-sm">View All</Link>
          </div>
          
          <Link to="/journal-history">
            <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center">
                <History size={20} className="text-jess-primary mr-3" />
                <span>View your journal history</span>
              </div>
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
        
        {/* Account Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-5">Account</h2>
          
          <Link to="/account">
            <div className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center">
                <User size={20} className="text-jess-primary mr-3" />
                <span>Manage your account</span>
              </div>
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
