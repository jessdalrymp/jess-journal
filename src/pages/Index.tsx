
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { AuthForm } from '../components/auth/AuthForm';
import { SelfDiscoveryQuiz } from '../components/onboarding/SelfDiscoveryQuiz';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Header } from '../components/Header';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';

const AppContent = () => {
  const { user, isNewUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      if (isNewUser || (profile && !profile.completedOnboarding)) {
        // Show onboarding if user is new or hasn't completed onboarding
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }
  }, [user, profile, authLoading, profileLoading, isNewUser]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-jess-subtle animate-pulse-soft flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-jess-primary"></div>
          </div>
          <p className="text-jess-muted">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Show onboarding if the user is new or hasn't completed it yet
  if (showOnboarding) {
    return <SelfDiscoveryQuiz onComplete={() => setShowOnboarding(false)} />;
  }

  // Otherwise, show the dashboard
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6">
        <Dashboard />
      </main>
      <DisclaimerBanner />
    </div>
  );
};

const Index = () => {
  return <AppContent />;
};

export default Index;
