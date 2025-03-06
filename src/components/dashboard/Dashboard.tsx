
import { useState, useEffect, useCallback } from 'react';
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
  const [isFetching, setIsFetching] = useState(false);

  // Fetch journal entries only once when the dashboard loads
  const loadJournalEntries = useCallback(async () => {
    if (user && !isFetching) {
      try {
        setIsFetching(true);
        console.log("Dashboard - Loading journal entries for user:", user.id);
        await fetchJournalEntries();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    }
  }, [user, fetchJournalEntries, isFetching]);

  // Load entries once when component mounts
  useEffect(() => {
    if (user && !isFetching) {
      loadJournalEntries();
    }
  }, [user, loadJournalEntries]);

  // No periodic refresh - removed to prevent excessive fetching

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
