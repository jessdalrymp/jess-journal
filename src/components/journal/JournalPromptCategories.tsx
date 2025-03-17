
import { useState } from 'react';
import { QuickJournalDialog } from './QuickJournalDialog';
import { PromptCategoryCard } from './PromptCategoryCard';
import { promptCategories, PromptCategory, Prompt } from './data/promptCategories';

export const JournalPromptCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePromptClickFactory = (category: PromptCategory) => {
    return (prompt: Prompt) => {
      console.log('Journal category prompt clicked:', { category: category.name, prompt });
      setSelectedCategory(category);
      setSelectedPrompt(prompt);
      setIsDialogOpen(true);
    };
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPrompt(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-jess-foreground">
        Daily Journaling Prompts
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptCategories.map((category) => (
          <PromptCategoryCard 
            key={category.id}
            category={category}
            onPromptClick={handlePromptClickFactory(category)}
          />
        ))}
      </div>
      
      <QuickJournalDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        category={selectedCategory}
        prompt={selectedPrompt}
      />
    </div>
  );
};
