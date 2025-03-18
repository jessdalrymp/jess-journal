
import { Button } from "@/components/ui/button";
import { promptCategories } from "./data/promptCategories";
import { PromptCategoryCard } from "./PromptCategoryCard";
import { JournalPromptSelectorHeader } from "./JournalPromptSelectorHeader";
import { JournalPromptSelectorGrid } from "./JournalPromptSelectorGrid";
import { PromptCategory, Prompt } from "./data/promptCategories";

interface JournalPromptSelectorProps {
  onPromptSelect: (category: PromptCategory, prompt: Prompt) => void;
  onSkip: () => void;
}

export const JournalPromptSelector = ({ onPromptSelect, onSkip }: JournalPromptSelectorProps) => {
  return (
    <div className="space-y-6">
      <JournalPromptSelectorHeader onSkip={onSkip} />
      <JournalPromptSelectorGrid onPromptSelect={onPromptSelect} />
    </div>
  );
};
