
import { Button } from "@/components/ui/button";

interface JournalPromptSelectorHeaderProps {
  onSkip: () => void;
}

export const JournalPromptSelectorHeader = ({ onSkip }: JournalPromptSelectorHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-jess-foreground">
        Choose a Journaling Prompt
      </h2>
    </div>
  );
};
