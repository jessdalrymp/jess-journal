
import { Button } from "@/components/ui/button";
import { promptCategories, PromptCategory, Prompt } from "./data/promptCategories";
import { PromptCategoryCard } from "./PromptCategoryCard";

interface JournalPromptSelectorProps {
  onPromptSelect: (category: PromptCategory, prompt: Prompt) => void;
  onSkip: () => void;
}

export const JournalPromptSelector = ({ onPromptSelect, onSkip }: JournalPromptSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-jess-foreground">
          Choose a Journaling Prompt
        </h2>
        <Button variant="ghost" onClick={onSkip}>
          Skip and write freely
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptCategories.map((category) => (
          <PromptCategoryCard 
            key={category.id}
            category={category} 
            onPromptClick={(category, prompt) => onPromptSelect(category, prompt)} 
          />
        ))}
      </div>
    </div>
  );
};
