
import { PromptCategory, Prompt } from './data/promptCategories';

interface PromptCategoryCardProps {
  category: PromptCategory;
  onPromptClick: (prompt: Prompt) => void;
}

export const PromptCategoryCard = ({ category, onPromptClick }: PromptCategoryCardProps) => {
  const IconComponent = category.icon.icon;
  
  const handlePromptClick = (prompt: Prompt) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Prompt clicked:', prompt);
    onPromptClick(prompt);
  };
  
  return (
    <div 
      className="bg-white shadow rounded-lg overflow-hidden border border-jess-subtle/50 hover:shadow-md transition-all"
    >
      <div className="p-4 bg-gradient-to-r from-jess-subtle/30 to-transparent flex items-center space-x-2">
        <IconComponent className={`h-5 w-5 ${category.icon.color}`} />
        <h3 className="font-medium text-jess-foreground">{category.name}</h3>
      </div>
      
      <div className="p-4 divide-y divide-jess-subtle/30">
        {category.prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={handlePromptClick(prompt)}
            type="button"
            className="py-2 w-full text-left text-sm hover:text-jess-primary transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
