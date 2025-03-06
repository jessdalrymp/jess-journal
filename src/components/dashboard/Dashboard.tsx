
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

  // Wrap fetchJournalEntries in useCallback to prevent infinite loops
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

  useEffect(() => {
    if (user && !isFetching) {
      loadJournalEntries();
    }
  }, [user, loadJournalEntries]);

  // Add periodic refresh with a longer interval (5 minutes instead of 60 seconds)
  // and prevent concurrent fetches
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      if (!isFetching) {
        console.log("Dashboard - Refreshing journal entries periodically");
        loadJournalEntries();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user, loadJournalEntries, isFetching]);

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
