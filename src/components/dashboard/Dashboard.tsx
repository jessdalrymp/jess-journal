
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
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  useEffect(() => {
    // Only fetch once per component mount
    if (!hasLoadedInitially && user) {
      const loadUserData = async () => {
        try {
          console.log("Dashboard - Loading journal entries for user:", user.id);
          await fetchJournalEntries();
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setIsLoading(false);
          setHasLoadedInitially(true);
        }
      };

      loadUserData();
    }
  }, [user, fetchJournalEntries, hasLoadedInitially]);

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
