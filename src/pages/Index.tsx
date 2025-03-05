
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { AuthProvider } from '../context/AuthContext';
import { UserDataProvider } from '../context/UserDataContext';
import { AuthForm } from '../components/auth/AuthForm';
import { SelfDiscoveryQuiz } from '../components/onboarding/SelfDiscoveryQuiz';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Header } from '../components/Header';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile) {
      setShowOnboarding(!profile.completedOnboarding);
    }
  }, [user, profile, authLoading, profileLoading]);

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

  if (showOnboarding) {
    return <SelfDiscoveryQuiz onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Dashboard />
      </main>
      <DisclaimerBanner />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <UserDataProvider>
        <AppContent />
      </UserDataProvider>
    </AuthProvider>
  );
};

export default Index;
