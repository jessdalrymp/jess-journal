
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { useToast } from "../hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/context/UserDataContext";

const MyStory = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { user } = useUserData();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if this is the first visit to the story page
    const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
    
    if (!hasVisitedStoryPage) {
      setShowWelcomeModal(true);
      // Mark that user has visited the page
      localStorage.setItem('hasVisitedStoryPage', 'true');
    } else if (user) {
      // Check if there are existing story conversations for this user
      const checkExistingConversations = async () => {
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id)
            .eq('type', 'story')
            .limit(1);
          
          if (error) {
            console.error('Error checking for existing conversations:', error);
            return;
          }
          
          if (data && data.length > 0) {
            toast({
              title: "Welcome back!",
              description: "Your previous conversation has been loaded.",
              duration: 3000,
            });
          }
        } catch (error) {
          console.error('Error in conversation check:', error);
        }
      };
      
      checkExistingConversations();
    }
  }, [user, toast]);
  
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <h1 className="text-2xl font-medium mb-6">Let's Get to Know You</h1>
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-260px)]">
          <ChatInterface type="story" onBack={() => window.history.back()} />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
        type="story"
      />
    </div>
  );
};

export default MyStory;
