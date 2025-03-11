
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JournalingDialog } from "../challenges/JournalingDialog";
import { JournalChallengeDisplay } from "./JournalChallengeDisplay";
import { JournalWelcomeModal } from "./JournalWelcomeModal";
import { useJournalPrompt } from "@/hooks/journal";

export const JournalChallengeContent = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const navigate = useNavigate();
  
  const {
    journalPrompt,
    isLoading,
    challengeAccepted,
    usePersonalized,
    hasEnoughEntries,
    generateNewPrompt,
    togglePersonalizedPrompts,
    acceptChallenge
  } = useJournalPrompt();

  useEffect(() => {
    // Show welcome modal only first time user visits this page
    const hasVisitedJournalChallenge = localStorage.getItem("hasVisitedJournalChallengePage");
    if (!hasVisitedJournalChallenge) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedJournalChallengePage", "true");
    }
  }, []); 

  const handleBack = () => {
    navigate('/');
  };

  const handleAcceptChallenge = () => {
    acceptChallenge();
    setShowJournaling(true);
  };

  return (
    <div className="p-6">
      <JournalChallengeDisplay
        journalPrompt={journalPrompt}
        onBack={handleBack}
        onAcceptChallenge={handleAcceptChallenge}
        onNewChallenge={generateNewPrompt}
        onTogglePersonalized={togglePersonalizedPrompts}
        isPersonalized={usePersonalized}
        hasEnoughEntries={hasEnoughEntries}
        isLoading={isLoading}
      />
      
      <JournalWelcomeModal 
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
      />

      <JournalingDialog
        open={showJournaling}
        onOpenChange={setShowJournaling}
        challengeType="journal"
        promptText={journalPrompt.prompt}
      />
    </div>
  );
};
