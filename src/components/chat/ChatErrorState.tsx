
import React from 'react';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatErrorStateProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  error: string;
}

export const ChatErrorState = ({ type, onBack, error }: ChatErrorStateProps) => {
  console.error(`Chat error state shown for ${type}:`, error);
  const navigate = useNavigate();
  
  const isConversationNotFound = error.includes("not found") || error.includes("not accessible");
  const isNetworkError = error.includes("network") || error.includes("Failed to fetch");
  const isPermissionError = error.includes("permission") || error.includes("401") || error.includes("403");
  const isJournalError = error.includes("journal") || error.includes("entries");
  
  const handleTryAgain = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    navigate('/dashboard');
  };
  
  let errorTitle = "Unable to load conversation";
  let errorMessage = error || "There was a problem loading this conversation. Please try again.";
  
  if (isConversationNotFound) {
    errorTitle = "Conversation not found";
    errorMessage = "The requested conversation couldn't be found. It may have been deleted or you might not have access to it.";
  } else if (isNetworkError) {
    errorTitle = "Network error";
    errorMessage = "There was a problem connecting to the server. Please check your internet connection and try again.";
  } else if (isPermissionError) {
    errorTitle = "Access denied";
    errorMessage = "You don't have permission to view this conversation. If you believe this is an error, please try signing out and back in.";
  } else if (isJournalError) {
    errorTitle = "Unable to load journal entries";
    errorMessage = "There was a problem loading your journal entries. Please try refreshing the page.";
  }
  
  return (
    <div className="h-full flex flex-col">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-700 mb-2">
            {errorTitle}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {errorMessage}
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
            <Button onClick={handleGoHome} size="sm" variant="secondary" className="flex items-center gap-1">
              <Home size={16} />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
