
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, MessageSquare, Pen, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { JournalPrompt } from "./JournalChallengeContent";
import { Switch } from "@/components/ui/switch";

interface JournalChallengeDisplayProps {
  journalPrompt: JournalPrompt;
  onBack: () => void;
  onAcceptChallenge: () => void;
  onNewChallenge: () => void;
  onStartChat: () => void;
  onTogglePersonalized?: () => void;
  isPersonalized?: boolean;
  hasEnoughEntries?: boolean;
  isLoading: boolean;
}

export const JournalChallengeDisplay = ({
  journalPrompt,
  onBack,
  onAcceptChallenge,
  onNewChallenge,
  onStartChat,
  onTogglePersonalized,
  isPersonalized = false,
  hasEnoughEntries = false,
  isLoading
}: JournalChallengeDisplayProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-jess-subtle flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium">Journal Challenge</h2>
      </div>
      
      <div className="flex-1 p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-lg">Generating your journal prompt...</p>
            </div>
          </div>
        ) : (
          <div>
            {hasEnoughEntries && onTogglePersonalized && (
              <div className="flex items-center justify-end mb-2 gap-2">
                <span className="text-xs text-gray-500">Personal Prompts</span>
                <Switch 
                  checked={isPersonalized} 
                  onCheckedChange={onTogglePersonalized} 
                  disabled={isLoading}
                />
                <Sparkles className="h-4 w-4 text-jess-primary" />
              </div>
            )}
            
            <h1 className="text-xl font-bold mb-2">{journalPrompt.title}</h1>
            <div className="mb-2 bg-jess-subtle p-3 rounded-lg">
              <p className="text-sm leading-tight">{journalPrompt.prompt}</p>
            </div>
            <h3 className="text-base font-medium mb-1.5">Instructions:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              {journalPrompt.instructions.map((instruction, index) => (
                <li key={index} className="text-sm leading-tight">{instruction}</li>
              ))}
            </ol>
            
            <div className="mt-4 pt-3 border-t border-jess-subtle">
              <h3 className="text-base font-medium mb-1.5">Guiding Questions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-sm leading-tight">What emotions came up as you reflected on this prompt?</li>
                <li className="text-sm leading-tight">What patterns or insights did you discover about yourself?</li>
                <li className="text-sm leading-tight">How might this reflection change your perspective going forward?</li>
                <li className="text-sm leading-tight">What specific actions could you take based on these insights?</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-jess-subtle flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-3">
        <div className="flex justify-center gap-2 sm:gap-3">
          <Button 
            onClick={onAcceptChallenge} 
            className="bg-jess-primary hover:bg-jess-primary/90 text-white shadow-md px-3 py-2 text-sm flex-grow sm:flex-grow-0"
            disabled={isLoading}
          >
            <Pen className="mr-2 h-4 w-4" />
            Start Journaling
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onNewChallenge}
            className="shadow-md px-3 py-2 text-sm flex-grow sm:flex-grow-0"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onStartChat}
          className="shadow-md px-3 py-2 text-sm mt-2 sm:mt-0"
          disabled={isLoading}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat with Jess
        </Button>
      </div>
    </div>
  );
};
