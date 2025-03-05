
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { clearCurrentConversationFromStorage } from "../lib/storageUtils";

const SideQuest = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [key, setKey] = useState(Date.now()); // Key to force ChatInterface remount
  const navigate = useNavigate();

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedSideQuest = localStorage.getItem("hasVisitedSideQuestPage");
    if (!hasVisitedSideQuest) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedSideQuestPage", "true");
      
      // Only clear conversation cache on first visit
      clearCurrentConversationFromStorage('sideQuest');
    }
  }, []); // Empty dependency array to ensure this only runs once

  const handleBack = () => {
    // Always clear conversation on exit
    clearCurrentConversationFromStorage('sideQuest');
    // Set a new key to force remount if user returns
    setKey(Date.now());
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <h1 className="text-2xl font-medium mb-6">Side Quest</h1>
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-260px)]">
          <ChatInterface 
            key={key} // The key ensures a fresh ChatInterface on each visit
            type="sideQuest" 
            onBack={handleBack} 
          />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal
        open={showWelcome}
        onOpenChange={setShowWelcome}
        title="Welcome to Side Quest"
        description="Here, you can work through specific challenges you're facing right now. I'll help you reframe your thinking and develop action steps to move forward."
        buttonText="Let's Tackle a Challenge"
      />
    </div>
  );
};

export default SideQuest;
