
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Check } from 'lucide-react';

interface ChatFooterProps {
  onEndChat: () => void;
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
}

export const ChatFooter = ({ onEndChat, onAcceptChallenge, onNewChallenge, type }: ChatFooterProps) => {
  return (
    <div className="p-3 border-t border-jess-subtle">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEndChat}
          className="text-xs px-2 py-1 h-auto"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          End Chat
        </Button>
        
        {type === 'action' && onAcceptChallenge && (
          <Button 
            size="sm" 
            onClick={onAcceptChallenge}
            className="text-xs px-2 py-1 h-auto bg-jess-primary hover:bg-jess-primary/90 text-white"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Accept Challenge
          </Button>
        )}
        
        {(type === 'action' || type === 'journal') && onNewChallenge && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewChallenge}
            className="text-xs px-2 py-1 h-auto"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            {type === 'action' ? 'New Challenge' : 'New Prompt'}
          </Button>
        )}
      </div>
    </div>
  );
};
