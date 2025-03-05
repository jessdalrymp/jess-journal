
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";
import { JournalEntry as JournalEntryType } from "../lib/types";
import { useUserData } from "../context/UserDataContext";

const JournalEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { journalEntries } = useUserData();
  const [entry, setEntry] = useState<JournalEntryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check if entry was passed via location state
    if (location.state?.entry) {
      setEntry(location.state.entry);
      setLoading(false);
      return;
    }
    
    // Otherwise, find by ID
    if (id && journalEntries.length > 0) {
      const foundEntry = journalEntries.find(entry => entry.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
      }
      setLoading(false);
    }
  }, [id, location.state, journalEntries]);

  // Function to safely render content with potential HTML
  const renderContent = (content: string) => {
    try {
      // Replace markdown code blocks and backticks with proper formatting
      const formattedContent = content
        .replace(/```[a-z]*\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto text-sm">$1</pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
        // Convert URLs to links
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 hover:underline">$1</a>');
      
      return { __html: formattedContent };
    } catch (error) {
      console.error("Error rendering content:", error);
      return { __html: content };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="text-center py-8">Loading...</div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto">
          <div className="text-center py-8">
            <p className="text-jess-muted mb-2">Entry not found</p>
            <ActionButton 
              type="primary" 
              className="mt-4" 
              onClick={() => navigate('/journal-history')}
            >
              Back to Journal History
            </ActionButton>
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => navigate('/journal-history')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Journal
          </ActionButton>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-semibold">{entry.title}</h1>
              <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
                {entry.type}
              </span>
            </div>
            <p className="text-sm text-jess-muted">
              {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={renderContent(entry.content)} />
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalEntry;
