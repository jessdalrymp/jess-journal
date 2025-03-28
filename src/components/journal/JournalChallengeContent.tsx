
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
  // Add a local state to track the toggle visually
  const [localPersonalizedState, setLocalPersonalizedState] = useState(false);
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

  // Sync local state with the usePersonalized from hook
  useEffect(() => {
    setLocalPersonalizedState(usePersonalized);
  }, [usePersonalized]);

  // Use useCallback to memoize handler functions
  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleAcceptChallenge = useCallback(() => {
    acceptChallenge();
    setShowJournaling(true);
  }, [acceptChallenge]);

  const handleNewChallenge = useCallback(() => {
    // Explicitly call generateNewPrompt when user requests a new prompt
    generateNewPrompt();
  }, [generateNewPrompt]);

  // Handle personalized toggle
  const handleTogglePersonalized = useCallback(() => {
    console.log('Toggling personalized prompts');
    // Update local state immediately for UI feedback
    setLocalPersonalizedState(prev => !prev);
    // Then call the actual toggle function from the hook
    togglePersonalizedPrompts();
  }, [togglePersonalizedPrompts]);

  // Mark initial load as complete after the first prompt load
  useEffect(() => {
    if (!isLoading && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [isLoading, initialLoadDone]);

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
        onNewChallenge={handleNewChallenge}
        onTogglePersonalized={handleTogglePersonalized}
        isPersonalized={localPersonalizedState}
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
