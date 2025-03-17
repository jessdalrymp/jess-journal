
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface FreePromptCardProps {
  prompt: string;
  icon: React.ReactNode;
  category: string;
}

export const FreePromptCard = ({ prompt, icon, category }: FreePromptCardProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2 text-jess-primary">
          {icon}
          <span className="text-sm font-medium">{category}</span>
        </div>
        
        <p className="text-jess-foreground flex-grow">{prompt}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs w-full justify-center"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied to clipboard</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy prompt</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
