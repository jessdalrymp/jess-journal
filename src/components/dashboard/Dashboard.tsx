
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

  useEffect(() => {
    // Always fetch when component mounts
    if (user) {
      const loadUserData = async () => {
        try {
          console.log("Dashboard - Loading journal entries for user:", user.id);
          await fetchJournalEntries();
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadUserData();
    }
  }, [user, fetchJournalEntries]);

  // Add an interval to periodically refresh journal entries (every 60 seconds)
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      console.log("Dashboard - Refreshing journal entries periodically");
      fetchJournalEntries().catch(error => {
        console.error("Error refreshing journal entries:", error);
      });
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, [user, fetchJournalEntries]);

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
