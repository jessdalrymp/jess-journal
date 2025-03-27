
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
      fetchJournalEntries(true) // Force refresh on mount
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
      {/* Main dashboard grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Core Actions Section - 6 columns on desktop */}
        <div className="md:col-span-7 lg:col-span-6 relative z-10">
          <CoreActionsSection />
        </div>
        
        {/* Journal History Section - 6 columns on desktop */}
        <div className="md:col-span-5 lg:col-span-6 relative z-10">
          <JournalHistorySection />
        </div>
        
        {/* Growth Insights - Full width */}
        {user && profile && !isLoading && (
          <div className="col-span-1 md:col-span-12 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
              {/* Subtle gradient background that matches CoreActionsSection */}
              <div className="absolute inset-0 bg-gradient-to-br from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <GrowthInsights />
              </div>
            </div>
          </div>
        )}
        
        {/* Account Section - Full width */}
        <div className="col-span-1 md:col-span-12 relative z-10">
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
