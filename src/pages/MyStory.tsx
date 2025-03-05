
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { WelcomeModal } from "../components/chat/WelcomeModal";

const MyStory = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit to the story page
    const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
    
    if (!hasVisitedStoryPage) {
      setShowWelcomeModal(true);
      // Mark that user has visited the page
      localStorage.setItem('hasVisitedStoryPage', 'true');
    }
  }, []);
  
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
