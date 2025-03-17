
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { CoreActionsSection } from './components/CoreActionsSection';
import { RecentActivitySection } from './components/RecentActivitySection';
import { JournalHistorySection } from './components/JournalHistorySection';
import { AccountSection } from './components/AccountSection';
import { DashboardWelcomeModal } from './WelcomeModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const { journalEntries, loading } = useUserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simply track the loading state
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoreActionsSection />
        <RecentActivitySection 
          journalEntries={journalEntries || []} 
          isLoading={isLoading} 
          loading={loading} 
        />
        <JournalHistorySection />
        <AccountSection />
      </div>
      <DashboardWelcomeModal />
    </div>
  );
};
