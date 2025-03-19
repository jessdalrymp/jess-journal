
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { CoreActionsSection } from './components/CoreActionsSection';
import { JournalHistorySection } from './components/JournalHistorySection';
import { AccountSection } from './components/AccountSection';
import { DashboardWelcomeModal } from './WelcomeModal';
import { FeatureTour } from './FeatureTour';
import { GrowthInsights } from './GrowthInsights';

export const Dashboard = () => {
  const { user } = useAuth();
  const { journalEntries, loading, profile, fetchJournalEntries } = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardInitialized, setDashboardInitialized] = useState(false);

  useEffect(() => {
    // Simply track the loading state
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);
  
  // Refresh entries when dashboard mounts or becomes visible
  useEffect(() => {
    if (user && !dashboardInitialized) {
      console.log("Dashboard mounted - refreshing journal entries");
      fetchJournalEntries()
        .then(() => setDashboardInitialized(true))
        .catch(err => console.error("Error refreshing journal entries:", err));
    }
  }, [user, fetchJournalEntries, dashboardInitialized]);
  
  // Also refresh when the window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        console.log("Window focused - refreshing journal entries");
        fetchJournalEntries().catch(err => 
          console.error("Error refreshing journal entries on focus:", err)
        );
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchJournalEntries]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      {/* Main dashboard container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl mb-6">
        <h2 className="text-2xl md:text-3xl font-medium mb-5 bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Dashboard</h2>
        
        {/* First row - 2 columns on lg screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
          <div className="core-actions-section">
            <CoreActionsSection />
          </div>
          <div className="journal-history-section">
            <JournalHistorySection />
          </div>
        </div>
        
        {/* Second row - 1 column since we removed the JournalHistorySection */}
        <div className="relative z-10">
          <div className="account-section">
            <AccountSection />
          </div>
        </div>
      </div>
      
      {/* Growth Insights below the dashboard container */}
      {user && profile && !isLoading && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl mb-6">
          <GrowthInsights />
        </div>
      )}
      
      {/* Decorative background elements for depth */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-jess-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-jess-secondary/5 rounded-full blur-3xl -z-10"></div>
      
      <DashboardWelcomeModal />
      <FeatureTour />
    </div>
  );
};
