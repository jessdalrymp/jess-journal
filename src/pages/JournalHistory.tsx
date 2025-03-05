
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { JournalEntry } from "../lib/types";
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";

const JournalHistory = () => {
  const { user } = useAuth();
  const { journalEntries } = useUserData();
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // Sort entries by date (newest first)
    const sorted = [...journalEntries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setSortedEntries(sorted);
  }, [journalEntries]);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="flex items-center mb-6">
          <ActionButton 
            type="ghost" 
            className="mr-4" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </ActionButton>
          <h1 className="text-2xl font-medium">Journal History</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          {sortedEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="border border-jess-subtle p-4 rounded-lg hover:border-jess-primary transition-colors">
                  <h3 className="text-lg font-medium mb-1">{entry.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jess-muted">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-xs px-2 py-1 bg-jess-subtle rounded-full">
                      {entry.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-jess-muted mb-2">No journal entries yet</p>
              <p className="text-sm text-jess-muted">Start a conversation to create entries</p>
            </div>
          )}
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};

export default JournalHistory;
