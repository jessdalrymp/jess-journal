
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

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
    <div className="bg-white border border-jess-subtle/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2 text-jess-primary">
        {icon}
        <span className="text-sm font-medium">{category}</span>
      </div>
      
      <p className="text-jess-foreground mb-4">{prompt}</p>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleCopy}
        className="flex items-center gap-1 text-xs"
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
    </div>
  );
};
