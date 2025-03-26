import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { AuthForm } from '../components/auth/AuthForm';
import { SelfDiscoveryQuiz } from '../components/onboarding/SelfDiscoveryQuiz';
import { Header } from '../components/Header';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { Dashboard } from '../components/dashboard/Dashboard';

// Add styles for tour highlight
const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 45;
    box-shadow: 0 0 0 4px rgba(130, 71, 229, 0.2), 0 0 0 8px rgba(130, 71, 229, 0.1);
    border-radius: 0.75rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 4px rgba(130, 71, 229, 0.2), 0 0 0 8px rgba(130, 71, 229, 0.1);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(130, 71, 229, 0.3), 0 0 0 8px rgba(130, 71, 229, 0.2);
    }
  }
`;

const Index = () => {
  const { user, isNewUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if auth form should be opened (e.g., from a "Sign In" button click)
  const shouldOpenAuth = location.state?.openAuth;

  // Clear the openAuth state after it's been used
  useEffect(() => {
    if (shouldOpenAuth && user) {
      navigate(location.pathname, { replace: true });
    }
  }, [shouldOpenAuth, user, navigate, location.pathname]);

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
      <style>{tourStyles}</style>
    </div>
  );
};

export default Index;
