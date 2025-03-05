
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatHeader } from './ChatHeader';

interface ChatLoadingStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatLoadingState = ({ type, onBack }: ChatLoadingStateProps) => {
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex items-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Loading conversation...
        </div>
      </div>
    </div>
  );
};
