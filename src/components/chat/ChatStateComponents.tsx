
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatLoadingState } from './ChatLoadingState';
import { ChatUnauthenticatedState } from './ChatUnauthenticatedState';
import { ChatErrorState } from './ChatErrorState';

interface ChatInitializingProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatInitializing = ({ type, onBack }: ChatInitializingProps) => {
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-500">Initializing conversation...</p>
        </div>
      </div>
    </div>
  );
};

export {
  ChatLoadingState,
  ChatUnauthenticatedState,
  ChatErrorState
};
