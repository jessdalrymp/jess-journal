
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { CoreActionsSection } from './components/CoreActionsSection';
import { RecentActivitySection } from './components/RecentActivitySection';
import { JournalHistorySection } from './components/JournalHistorySection';
import { AccountSection } from './components/AccountSection';
import { DashboardWelcomeModal } from './WelcomeModal';
import { FeatureTour } from './FeatureTour';
import { GrowthInsights } from './GrowthInsights';

export const Dashboard = () => {
  const { user } = useAuth();
  const { journalEntries, loading, profile } = useUserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simply track the loading state
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-3 relative">
      {/* First row - 2 columns on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 relative z-10">
        <div className="core-actions-section">
          <CoreActionsSection />
        </div>
        <div className="recent-activity-section">
          <RecentActivitySection 
            journalEntries={journalEntries || []} 
            isLoading={isLoading} 
            loading={loading} 
          />
        </div>
      </div>
      
      {/* Growth Insights - Moved here to appear before Journal History */}
      {user && profile && !isLoading && (
        <div className="mb-3">
          <GrowthInsights />
        </div>
      )}
      
      {/* Second row - 2 columns on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 relative z-10">
        <div className="journal-history-section">
          <JournalHistorySection />
        </div>
        <div className="account-section">
          <AccountSection />
        </div>
      </div>
      
      {/* Decorative background elements for depth */}
      <div className="absolute top-10 right-5 w-32 h-32 bg-jess-primary/5 rounded-full blur-2xl -z-10"></div>
      <div className="absolute bottom-10 left-5 w-36 h-36 bg-jess-secondary/5 rounded-full blur-2xl -z-10"></div>
      
      <DashboardWelcomeModal />
      <FeatureTour />
    </div>
  );
};
