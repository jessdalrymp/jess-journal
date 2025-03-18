
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { JournalingDialog } from "../challenges/JournalingDialog";
import { JournalChallengeDisplay } from "./JournalChallengeDisplay";
import { JournalWelcomeModal } from "./JournalWelcomeModal";
import { useJournalPrompt } from "@/hooks/journal";

export const JournalChallengeContent = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
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

  // Use useCallback to memoize handler functions
  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleAcceptChallenge = useCallback(() => {
    acceptChallenge();
    setShowJournaling(true);
  }, [acceptChallenge]);

  // Mark initial load as complete after the first prompt load
  useEffect(() => {
    if (!isLoading && !initialLoadDone) {
      setInitialLoadDone(true);
      
      // Store the current prompt in localStorage to speed up future loads
      if (journalPrompt && journalPrompt.title) {
        localStorage.setItem('currentJournalPrompt', JSON.stringify(journalPrompt));
      }
    }
  }, [isLoading, initialLoadDone, journalPrompt]);

  // Load welcome modal check once on component mount
  useEffect(() => {
    // Check if we should show the welcome modal
    const hasVisitedJournalChallenge = localStorage.getItem("hasVisitedJournalChallengePage");
    if (!hasVisitedJournalChallenge) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedJournalChallengePage", "true");
    }
  }, []); 

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
        isLoading={isLoading && !initialLoadDone} // Only show loading on initial load
      />
      
      {/* Only render modals when needed */}
      {showWelcome && (
        <JournalWelcomeModal 
          showWelcome={showWelcome}
          setShowWelcome={setShowWelcome}
        />
      )}

      {showJournaling && (
        <JournalingDialog
          open={showJournaling}
          onOpenChange={setShowJournaling}
          challengeType="journal"
          promptText={journalPrompt.prompt}
        />
      )}
    </div>
  );
};
