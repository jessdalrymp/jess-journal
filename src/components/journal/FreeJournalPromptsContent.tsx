
import React, { useState } from 'react';
import { promptCategories, PromptCategory, Prompt } from './data/promptCategories';
import { Card, CardContent } from "@/components/ui/card";
import { FreePromptCard } from './FreePromptCard';
import { DailyFeaturedPrompt } from './DailyFeaturedPrompt';
import { Button } from '@/components/ui/button';

export const FreeJournalPromptsContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  
  const handleCategorySelect = (category: PromptCategory) => {
    setSelectedCategory(category);
  };
  
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Daily featured prompt section */}
      <DailyFeaturedPrompt />
      
      {selectedCategory ? (
        // Show prompts from the selected category
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCategory.icon}
                <h2 className="text-xl font-medium">{selectedCategory.name}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToCategories}
              >
                Back to Categories
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {selectedCategory.prompts.map((prompt, index) => (
                <FreePromptCard 
                  key={`${selectedCategory.id}-${index}`}
                  prompt={prompt} 
                  icon={selectedCategory.icon}
                  category={selectedCategory.name}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Show category selection
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-medium mb-4">Choose a Prompt Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {promptCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-3 text-center"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="text-2xl">{category.icon}</div>
                  <span className="font-medium">{category.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
