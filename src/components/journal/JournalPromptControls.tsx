
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JournalPromptControlsProps {
  onTogglePersonalized: () => void;
  onSavePrompt?: () => void;
  isPersonalized: boolean;
  hasEnoughEntries: boolean;
  isLoading: boolean;
  promptSaved: boolean;
}

export const JournalPromptControls = ({
  onTogglePersonalized,
  onSavePrompt,
  isPersonalized,
  hasEnoughEntries,
  isLoading,
  promptSaved
}: JournalPromptControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      {hasEnoughEntries && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Personal Prompts</span>
          <Switch 
            checked={isPersonalized} 
            onCheckedChange={onTogglePersonalized} 
            disabled={isLoading}
          />
          <Sparkles className="h-4 w-4 text-jess-primary" />
        </div>
      )}
      
      {onSavePrompt && !isLoading && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onSavePrompt}
                disabled={promptSaved}
                className="ml-auto"
              >
                <Bookmark className={`h-5 w-5 ${promptSaved ? 'text-jess-primary' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{promptSaved ? 'Prompt saved' : 'Save this prompt'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
