
import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MyStory = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingConversations, setIsCheckingConversations] = useState(false);
  const initializationAttempted = useRef(false);
  const { user, loading: userLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("MyStory - Auth state:", user ? "Authenticated" : "Not authenticated", "Loading:", userLoading);
    
    // Only proceed if we have a definitive authentication state and haven't attempted initialization
    if (userLoading || initializationAttempted.current) {
      return; // Wait until user authentication state is resolved or skip if already attempted
    }
    
    initializationAttempted.current = true;
    
    if (!user) {
      setIsLoading(false);
      return; // Not authenticated, don't try to load conversations
    }
    
    // Check if this is the first visit to the story page
    const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
    
    if (!hasVisitedStoryPage) {
      console.log("First visit to story page, showing welcome modal");
      setShowWelcomeModal(true);
      // Mark that user has visited the page
      localStorage.setItem('hasVisitedStoryPage', 'true');
      setIsLoading(false);
    } else {
      // Check if there are existing story conversations for this user
      const checkExistingConversations = async () => {
        setIsCheckingConversations(true);
        try {
          console.log("Checking for existing story conversations for user:", user.id);
          const { data, error } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id)
            .eq('type', 'story')
            .limit(1);
          
          if (error) {
            console.error('Error checking for existing conversations:', error);
            setIsLoading(false);
            return;
          }
          
          if (data && data.length > 0) {
            console.log("Found existing story conversations:", data.length);
            toast({
              title: "Welcome back!",
              description: "Your previous conversation has been loaded.",
              duration: 3000,
            });
          } else {
            console.log("No existing story conversations found");
          }
        } catch (error) {
          console.error('Error in conversation check:', error);
        } finally {
          setIsCheckingConversations(false);
          setIsLoading(false);
        }
      };
      
      checkExistingConversations();
    }
  }, [user, toast, userLoading]);
  
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setIsLoading(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSignIn = () => {
    navigate('/', { state: { openAuth: true } });
  };

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 py-6 container mx-auto flex items-center justify-center">
          <div className="animate-pulse flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading...
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  if (!user) {
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <h1 className="text-2xl font-medium mb-6">Let's Get to Know You</h1>
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-260px)]">
          <ChatInterface type="story" onBack={handleBack} />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal 
        open={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal}
        title="Welcome to Your Story" 
        description="Let's get to know you better"
        buttonText="Let's Begin"
        type="story"
      />
    </div>
  );
};

export default MyStory;
