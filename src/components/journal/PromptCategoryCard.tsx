
import { PromptCategory, Prompt } from './data/promptCategories';

interface PromptCategoryCardProps {
  category: PromptCategory;
  onPromptClick: (category: PromptCategory, prompt: Prompt) => void;
}

export const PromptCategoryCard = ({ category, onPromptClick }: PromptCategoryCardProps) => {
  return (
    <div 
      className="bg-white shadow rounded-lg overflow-hidden border border-jess-subtle/50 hover:shadow-md transition-all"
    >
      <div className="p-4 bg-gradient-to-r from-jess-subtle/30 to-transparent flex items-center space-x-2">
        {category.icon}
        <h3 className="font-medium text-jess-foreground">{category.name}</h3>
      </div>
      
      <div className="p-4 divide-y divide-jess-subtle/30">
        {category.prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(category, prompt)}
            className="py-2 w-full text-left text-sm hover:text-jess-primary transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
