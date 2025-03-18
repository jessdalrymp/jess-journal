
import { promptCategories, PromptCategory, Prompt } from "./data/promptCategories";
import { PromptCategoryCard } from "./PromptCategoryCard";

interface JournalPromptSelectorGridProps {
  onPromptSelect: (category: PromptCategory, prompt: Prompt) => void;
}

export const JournalPromptSelectorGrid = ({ onPromptSelect }: JournalPromptSelectorGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {promptCategories.map((category) => (
        <PromptCategoryCard 
          key={category.id}
          category={category} 
          onPromptClick={(category, prompt) => onPromptSelect(category, prompt)} 
        />
      ))}
    </div>
  );
};
