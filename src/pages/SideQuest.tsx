
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/chat/WelcomeModal";

const SideQuest = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedSideQuest = localStorage.getItem("hasVisitedSideQuestPage");
    if (!hasVisitedSideQuest) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedSideQuestPage", "true");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <h1 className="text-2xl font-medium mb-6">Side Quest</h1>
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-260px)]">
          <ChatInterface 
            type="sideQuest" 
            onBack={() => navigate('/')} 
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
