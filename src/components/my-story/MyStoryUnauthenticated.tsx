
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import { Button } from "../../components/ui/button";

export const MyStoryUnauthenticated = () => {
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    navigate('/', { state: { openAuth: true } });
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-medium mb-4">Sign In Required</h2>
          <p className="mb-6">Please sign in to access your personal story.</p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleSignIn} className="w-full">
              Sign In
            </Button>
            <Button onClick={handleBack} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <DisclaimerBanner />
    </div>
  );
};
