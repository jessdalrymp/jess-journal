
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ChatErrorStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  error: string;
}

export const ChatErrorState = ({ type, onBack, error }: ChatErrorStateProps) => {
  console.log(`Chat error state shown for ${type}:`, error);
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-700 mb-2">Unable to load conversation</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error || "There was a problem loading this conversation. Please try again."}
          </p>
          <Button onClick={onBack} size="sm" variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
