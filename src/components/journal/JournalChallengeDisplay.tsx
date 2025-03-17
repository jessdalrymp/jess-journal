
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Pen, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { JournalPrompt } from "@/hooks/useJournalPrompt";

interface JournalChallengeDisplayProps {
  journalPrompt: JournalPrompt;
  onBack: () => void;
  onAcceptChallenge: () => void;
  onNewChallenge: () => void;
  onTogglePersonalized?: () => void;
  isPersonalized?: boolean;
  hasEnoughEntries?: boolean;
  isLoading: boolean;
}

// Use memo to prevent unnecessary re-renders
export const JournalChallengeDisplay = memo(({
  journalPrompt,
  onBack,
  onAcceptChallenge,
  onNewChallenge,
  onTogglePersonalized,
  isPersonalized = false,
  hasEnoughEntries = false,
  isLoading
}: JournalChallengeDisplayProps) => {
  return (
    <div className="flex flex-col">
      <div className="p-2 border-b border-jess-subtle flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2 interactive-button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium">Journal Challenge</h2>
      </div>
      
      <div className="p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-lg">Generating your journal prompt...</p>
            </div>
          </div>
        ) : (
          <div>
            {hasEnoughEntries && onTogglePersonalized && (
              <div className="flex items-center justify-end mb-2 gap-2">
                <span className="text-xs text-jess-foreground">Personal Prompts</span>
                <Switch 
                  checked={isPersonalized} 
                  onCheckedChange={onTogglePersonalized} 
                  disabled={isLoading}
                />
                <Sparkles className="h-4 w-4 text-jess-primary" />
              </div>
            )}
            
            <h1 className="text-xl font-bold mb-2">{journalPrompt.title}</h1>
            <div className="mb-4 bg-jess-subtle p-3 rounded-lg">
              <p className="text-sm leading-tight">{journalPrompt.prompt}</p>
            </div>
            
            {/* Instructions section removed as requested */}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-jess-subtle flex flex-row justify-center gap-3">
        <Button 
          onClick={onAcceptChallenge} 
          className="bg-jess-primary hover:bg-jess-primary/90 text-white shadow-md px-3 py-2 text-sm interactive-button"
          disabled={isLoading}
        >
          <Pen className="mr-2 h-4 w-4" />
          Start Journaling
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onNewChallenge}
          className="shadow-md px-3 py-2 text-sm interactive-button"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Prompt
        </Button>
      </div>
    </div>
  );
});

// Add display name for debugging
JournalChallengeDisplay.displayName = 'JournalChallengeDisplay';
