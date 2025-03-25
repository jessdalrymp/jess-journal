
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ChatErrorStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  error: string;
}

export const ChatErrorState = ({ type, onBack, error }: ChatErrorStateProps) => {
  console.log(`Chat error state shown for ${type}:`, error);
  
  const isConversationNotFound = error.includes("not found") || error.includes("not accessible");
  
  const handleTryAgain = () => {
    window.location.reload();
  };
  
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-700 mb-2">
            {isConversationNotFound ? "Conversation not found" : "Unable to load conversation"}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {isConversationNotFound 
              ? "The requested conversation couldn't be found. It may have been deleted or you might not have access to it."
              : error || "There was a problem loading this conversation. Please try again."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={onBack} size="sm" variant="outline" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Go Back
            </Button>
            <Button onClick={handleTryAgain} size="sm" variant="default" className="flex items-center gap-1">
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
