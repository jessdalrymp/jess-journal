
import React, { useState, useEffect } from 'react';
import { promptCategories, PromptCategory } from './data/promptCategories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreePromptCard } from './FreePromptCard';
import { DailyFeaturedPrompt } from './DailyFeaturedPrompt';
import { ScrollArea } from "@/components/ui/scroll-area";

export const FreeJournalPromptsContent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("featured");

  return (
    <div className="space-y-6">
      {/* Daily featured prompt section */}
      {selectedCategory === "featured" && (
        <DailyFeaturedPrompt />
      )}
      
      <Tabs defaultValue="featured" onValueChange={setSelectedCategory}>
        <div className="relative">
          <ScrollArea className="w-full pb-2">
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
          </ScrollArea>
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
            
            <ScrollArea className="h-[500px] pr-4">
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
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
