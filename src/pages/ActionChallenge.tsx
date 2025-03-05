
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { ChatInterface } from "../components/chat/ChatInterface";
import { useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { clearCurrentConversationFromStorage } from "../lib/storageUtils";
import { ChallengeSuccessDialog } from "../components/challenges/ChallengeSuccessDialog";
import { JournalingDialog } from "../components/challenges/JournalingDialog";

const ActionChallenge = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [key, setKey] = useState(Date.now()); // Force remount when needed
  const navigate = useNavigate();

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedActionChallenge = localStorage.getItem("hasVisitedActionChallengePage");
    if (!hasVisitedActionChallenge) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedActionChallengePage", "true");
      
      // Only clear conversation cache on first visit
      clearCurrentConversationFromStorage('action');
    }
  }, []); // Empty dependency array to ensure this only runs once

  const handleBack = () => {
    // Always clear conversation on exit
    clearCurrentConversationFromStorage('action');
    // Set a new key to force remount if user returns
    setKey(Date.now());
    navigate('/');
  };

  const handleAcceptChallenge = () => {
    setShowSuccess(true);
  };

  const handleStartJournaling = () => {
    setShowSuccess(false);
    setShowJournaling(true);
  };

  const handleRestart = () => {
    // Clear existing conversation
    clearCurrentConversationFromStorage('action');
    // Set a new key to force remount 
    setKey(Date.now());
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 py-6 container mx-auto">
        <h1 className="text-2xl font-medium mb-6">Action Challenge</h1>
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-260px)]">
          <ChatInterface 
            key={key}
            type="action" 
            onBack={handleBack}
            onAcceptChallenge={handleAcceptChallenge} 
            onRestart={handleRestart}
          />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal
        open={showWelcome}
        onOpenChange={setShowWelcome}
        title="Welcome to Action Challenge"
        description="Here you'll receive a personalized challenge designed to create real shifts in your thinking and behavior. These challenges are experiential and designed to help you break out of your habitual patterns."
        buttonText="Let's Begin"
      />

      <ChallengeSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        onStartJournaling={handleStartJournaling}
      />

      <JournalingDialog
        open={showJournaling}
        onOpenChange={setShowJournaling}
        challengeType="action"
      />
    </div>
  );
};

export default ActionChallenge;
