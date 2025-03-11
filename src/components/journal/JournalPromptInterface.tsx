
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Bookmark } from "lucide-react";
import { JournalChallengeDisplay } from "./JournalChallengeDisplay";
import { SavedPromptsList } from "./SavedPromptsList";
import { JournalPrompt } from "./JournalChallengeContent";
import { SavedPrompt } from "../../services/savedPromptsService";
import { WelcomeModal } from "../chat/WelcomeModal";
import { JournalingDialog } from "../challenges/JournalingDialog";

interface JournalPromptInterfaceProps {
  journalPrompt: JournalPrompt | null;
  isLoading: boolean;
  promptSaved: boolean;
  usePersonalized: boolean;
  hasEnoughEntries: boolean;
  onGenerateNewChallenge: () => void;
  onSavePrompt: () => void;
  onSelectSavedPrompt: (savedPrompt: SavedPrompt) => void;
  onTogglePersonalized: () => void;
}

export const JournalPromptInterface: React.FC<JournalPromptInterfaceProps> = ({
  journalPrompt,
  isLoading,
  promptSaved,
  usePersonalized,
  hasEnoughEntries,
  onGenerateNewChallenge,
  onSavePrompt,
  onSelectSavedPrompt,
  onTogglePersonalized
}) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showJournaling, setShowJournaling] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const navigate = useNavigate();

  // Check if this is the first visit to show welcome modal
  React.useEffect(() => {
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
    setChallengeAccepted(true);
    setShowJournaling(true);
  };

  const handleChatView = () => {
    if (journalPrompt) {
      localStorage.setItem('currentJournalPrompt', JSON.stringify(journalPrompt));
      navigate('/journal-challenge/chat');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-2 border-b border-jess-subtle">
        <Button 
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => setShowSavedPrompts(true)}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          Saved Prompts
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {journalPrompt && (
          <JournalChallengeDisplay
            journalPrompt={journalPrompt}
            onBack={handleBack}
            onAcceptChallenge={handleAcceptChallenge}
            onNewChallenge={onGenerateNewChallenge}
            onStartChat={handleChatView}
            onTogglePersonalized={onTogglePersonalized}
            onSavePrompt={onSavePrompt}
            isPersonalized={usePersonalized}
            hasEnoughEntries={hasEnoughEntries}
            isLoading={isLoading}
            promptSaved={promptSaved}
          />
        )}
      </div>
      
      <Sheet open={showSavedPrompts} onOpenChange={setShowSavedPrompts}>
        <SheetContent side="left" className="w-full sm:max-w-md p-0">
          <SavedPromptsList onSelectPrompt={(savedPrompt) => {
            onSelectSavedPrompt(savedPrompt);
            setShowSavedPrompts(false);
          }} />
        </SheetContent>
      </Sheet>
      
      <WelcomeModal
        open={showWelcome}
        onOpenChange={setShowWelcome}
        title="Welcome to Journal Challenge"
        description="Here you'll receive personalized writing prompts designed to help you reflect on your patterns, growth, and insights. These prompts will guide you to deeper self-awareness through regular journaling practice."
        buttonText="Let's Begin"
      />

      <JournalingDialog
        open={showJournaling}
        onOpenChange={setShowJournaling}
        challengeType="journal"
        promptText={journalPrompt?.prompt || ""}
      />
    </div>
  );
};
