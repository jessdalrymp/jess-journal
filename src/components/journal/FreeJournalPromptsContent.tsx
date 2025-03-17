
import React, { useState } from 'react';
import { promptCategories } from './data/promptCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreePromptCard } from './FreePromptCard';
import { DailyFeaturedPrompt } from './DailyFeaturedPrompt';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FreeJournalPromptsContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("featured");
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScrollLeft = () => {
    const tabsList = document.querySelector('[role="tabslist"]');
    if (tabsList) {
      const newPosition = Math.max(scrollPosition - 200, 0);
      tabsList.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleScrollRight = () => {
    const tabsList = document.querySelector('[role="tabslist"]');
    if (tabsList) {
      const maxScroll = tabsList.scrollWidth - tabsList.clientWidth;
      const newPosition = Math.min(scrollPosition + 200, maxScroll);
      tabsList.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily featured prompt section */}
      {selectedCategory === "featured" && (
        <DailyFeaturedPrompt />
      )}
      
      <Tabs defaultValue="featured" onValueChange={setSelectedCategory}>
        <div className="relative flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={handleScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          
          <div className="w-full overflow-x-auto scrollbar-hide px-8">
            <TabsList className="w-full flex justify-start sm:justify-center flex-nowrap">
              <TabsTrigger value="featured" className="text-sm">
                Featured
              </TabsTrigger>
              {promptCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-sm whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
        
        <TabsContent value="featured" className="mt-6">
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-medium">Featured Prompts</h2>
            <p className="text-sm text-jess-foreground/70">
              A selection of our favorite prompts across different categories.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {promptCategories.slice(0, 6).map((category) => (
              <FreePromptCard 
                key={`featured-${category.id}`}
                prompt={category.prompts[0]} 
                icon={category.icon}
                category={category.name}
              />
            ))}
          </div>
        </TabsContent>
        
        {promptCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="space-y-2 mb-4">
              <h2 className="text-xl font-medium flex items-center gap-2">
                {category.icon}
                {category.name}
              </h2>
              <p className="text-sm text-jess-foreground/70">
                Explore all prompts in this category.
              </p>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2">
                {category.prompts.map((prompt, index) => (
                  <FreePromptCard 
                    key={`${category.id}-${index}`}
                    prompt={prompt} 
                    icon={category.icon}
                    category={category.name}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
