
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      {/* Growth Insights - New AI-powered component */}
      {user && profile && !isLoading && (
        <GrowthInsights />
      )}
      
      {/* First row - 2 columns on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
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
      
      {/* Second row - 2 columns on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="journal-history-section">
          <JournalHistorySection />
        </div>
        <div className="account-section">
          <AccountSection />
        </div>
      </div>
      
      {/* Decorative background elements for depth */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-jess-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-jess-secondary/5 rounded-full blur-3xl -z-10"></div>
      
      <DashboardWelcomeModal />
      <FeatureTour />
    </div>
  );
};
