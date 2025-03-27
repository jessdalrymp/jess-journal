
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ChatErrorStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  error: string;
  onRetry?: () => void;
}

export const ChatErrorState = ({ type, onBack, error, onRetry }: ChatErrorStateProps) => {
  console.log(`Chat error state shown for ${type}:`, error);
  
  // Try to format the error message to be more user-friendly
  const getFormattedError = (errorMsg: string) => {
    if (errorMsg.includes('Failed to create conversation - no ID returned')) {
      return "We couldn't start a new conversation. This could be due to a temporary service issue.";
    }
    if (errorMsg.includes('not found or not accessible')) {
      return "The conversation you're trying to access doesn't exist or you don't have permission to view it.";
    }
    if (errorMsg.includes('Cannot access conversations table')) {
      return "We're having trouble accessing the conversations system. Please try again later.";
    }
    if (errorMsg.includes('No user ID provided')) {
      return "There was an authentication issue. Please try signing out and back in.";
    }
    return errorMsg || "There was a problem loading this conversation. Please try again.";
  };
  
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
            {getFormattedError(error)}
          </p>
          <div className="flex space-x-3 justify-center">
            <Button onClick={onBack} size="sm" variant="outline">
              Go Back
            </Button>
            {onRetry && (
              <Button onClick={onRetry} size="sm" variant="default" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
