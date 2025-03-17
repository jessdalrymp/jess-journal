
import { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PromptCategoryCard } from './PromptCategoryCard';
import { QuickJournalDialog } from './QuickJournalDialog';
import { promptCategories, PromptCategory, Prompt } from './data/promptCategories';

export const NewJournalEntryButton = () => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);

  const handleClick = () => {
    setShowPrompts(true);
  };

  const handlePromptClick = (category: PromptCategory, prompt: Prompt) => {
    setSelectedCategory(category);
    setSelectedPrompt(prompt);
    setShowPrompts(false);
    setIsJournalDialogOpen(true);
  };

  const handleCloseJournalDialog = () => {
    setIsJournalDialogOpen(false);
    setSelectedPrompt(null);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="bg-gradient-to-br from-jess-subtle/80 to-white rounded-lg h-full p-5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-br hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50"
      >
        <div className="text-jess-primary mb-3">
          <FilePlus size={24} className="transition-transform duration-300 hover:scale-110" />
        </div>
        <h3 className="text-center font-medium">New Journal Entry</h3>
      </div>

      {/* Prompt Selection Dialog */}
      <Dialog open={showPrompts} onOpenChange={setShowPrompts}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choose a Journaling Prompt</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2 max-h-[60vh] overflow-y-auto p-1">
            {promptCategories.map((category) => (
              <PromptCategoryCard 
                key={category.id}
                category={category}
                onPromptClick={(prompt) => handlePromptClick(category, prompt)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Journal Dialog */}
      <QuickJournalDialog 
        isOpen={isJournalDialogOpen}
        onClose={handleCloseJournalDialog}
        category={selectedCategory}
        prompt={selectedPrompt}
      />
    </>
  );
};
