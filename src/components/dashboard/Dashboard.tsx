
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { CoreActionsSection } from './components/CoreActionsSection';
import { RecentActivitySection } from './components/RecentActivitySection';
import { JournalHistorySection } from './components/JournalHistorySection';
import { AccountSection } from './components/AccountSection';

export const Dashboard = () => {
  const { user } = useAuth();
  const { journalEntries, fetchJournalEntries, loading } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user && !initialized && !loading) {
      const loadUserData = async () => {
        try {
          console.log("Dashboard - Loading journal entries for user:", user.id);
          await fetchJournalEntries();
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setIsLoading(false);
          setInitialized(true);
        }
      };

      loadUserData();
    } else if (!loading) {
      // If we're not loading but also don't have a user, we should stop showing the loading indicator
      setIsLoading(false);
    }
  }, [user, fetchJournalEntries, loading, initialized]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoreActionsSection />
        <RecentActivitySection 
          journalEntries={journalEntries} 
          isLoading={isLoading} 
          loading={loading} 
        />
        <JournalHistorySection />
        <AccountSection />
      </div>
    </div>
  );
};
