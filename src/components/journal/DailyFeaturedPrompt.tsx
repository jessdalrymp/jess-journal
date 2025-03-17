
import React, { useState, useEffect } from 'react';
import { JournalPrompt } from '@/hooks/journal/types';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { promptCategories } from './data/promptCategories';

// Helper function to get a deterministic prompt based on the day
const getDailyPrompt = (): JournalPrompt => {
  // Use the date to select a prompt (this will change daily)
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  
  // Use the day and month to select a category and prompt
  const categoryIndex = day % promptCategories.length;
  const category = promptCategories[categoryIndex];
  
  const promptIndex = (day + month) % category.prompts.length;
  const promptText = category.prompts[promptIndex];
  
  return {
    title: `Daily Prompt: ${category.name}`,
    prompt: promptText,
    instructions: [
      "Take 5-10 minutes to reflect on this prompt",
      "Write freely without judging your thoughts",
      "Look for patterns or insights in your response",
      "Consider how you might apply these reflections"
    ]
  };
};

export const DailyFeaturedPrompt = () => {
  const [prompt, setPrompt] = useState<JournalPrompt>(getDailyPrompt());
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const textToCopy = `${prompt.title}\n\n${prompt.prompt}\n\nInstructions:\n${prompt.instructions.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-jess-subtle/20 border border-jess-subtle rounded-lg p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-jess-primary">Today's Featured Prompt</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-lg mb-1">{prompt.title}</h3>
        <p className="text-jess-foreground text-lg italic">{prompt.prompt}</p>
      </div>
      
      <div className="bg-white p-4 rounded-md border border-jess-subtle/50">
        <h4 className="font-medium mb-2">Journaling Instructions:</h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {prompt.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
      
      <p className="text-xs text-jess-foreground/60 mt-4">
        New prompt available every day. Copy and paste into your favorite document editor.
      </p>
    </div>
  );
};
