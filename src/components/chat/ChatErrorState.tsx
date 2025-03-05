
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';

interface ChatErrorStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  error: string;
}

export const ChatErrorState = ({ type, onBack, error }: ChatErrorStateProps) => {
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-2">Unable to load conversation</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={onBack} size="sm" variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
