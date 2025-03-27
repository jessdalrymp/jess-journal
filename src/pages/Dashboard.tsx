import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { AuthForm } from '../components/auth/AuthForm';
import { SelfDiscoveryQuiz } from '../components/onboarding/SelfDiscoveryQuiz';
import { Header } from '../components/Header';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { Dashboard as DashboardContent } from '../components/dashboard/Dashboard';

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

const Dashboard = () => {
  const { user, isNewUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const shouldOpenAuth = location.state?.openAuth;

  useEffect(() => {
    if (shouldOpenAuth && user) {
      navigate(location.pathname, { replace: true });
    }
  }, [shouldOpenAuth, user, navigate, location.pathname]);

  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      console.log("Dashboard - User authenticated, checking if onboarding needed");
      if (isNewUser || (profile && !profile.completedOnboarding)) {
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
    console.log("Dashboard - No user authenticated, showing auth form");
    return <AuthForm />;
  }

  if (showOnboarding) {
    console.log("Dashboard - Showing onboarding quiz");
    return <SelfDiscoveryQuiz onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6">
        <DashboardContent />
      </main>
      <DisclaimerBanner />
      <style>{tourStyles}</style>
    </div>
  );
};

export default Dashboard;
