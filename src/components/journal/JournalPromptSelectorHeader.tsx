
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface JournalPromptSelectorHeaderProps {
  onSkip: () => void;
}

export const JournalPromptSelectorHeader = ({ onSkip }: JournalPromptSelectorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-jess-foreground">
        Choose a Journaling Prompt
      </h2>
      <Button 
        onClick={onSkip} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Pencil size={16} />
        Write Freely
      </Button>
    </div>
  );
};
