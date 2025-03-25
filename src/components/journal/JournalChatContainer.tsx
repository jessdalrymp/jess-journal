
import { useState, useEffect } from "react";
import { ChatInterface } from "../chat/ChatInterface";
import { getInitialMessage } from "../chat/chatUtils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface JournalChatContainerProps {
  onBack: () => void;
  onSave?: () => void;
  initialPrompt?: string;
  skipPrompt?: boolean;
}

export const JournalChatContainer = ({ 
  onBack, 
  onSave,
  initialPrompt,
  skipPrompt = false
}: JournalChatContainerProps) => {
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Give a short delay to allow initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleError = (errorMessage: string) => {
    console.error("Journal chat error:", errorMessage);
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Error starting journal session",
      description: errorMessage || "Failed to start journal session. Please try again.",
    });
  };

  const handleEndChat = () => {
    console.log("Ending journal chat and saving...");
    toast({
      title: "Saving your journal entry",
      description: "We're saving your journal entry",
    });
    
    if (onSave) {
      onSave();
    }
    
    // Add a short delay before navigating to ensure the save operation completes
    setTimeout(() => {
      // Navigate to journal history to see the saved entry
      console.log("Navigating to dashboard after saving journal entry");
      navigate('/dashboard');
    }, 1000);
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  // Use custom initial message if provided, otherwise use a general initial message
  // If skipPrompt is true, use a message that bypasses the normal journal prompting flow
  const getCustomInitialMessage = () => {
    if (skipPrompt) {
      return "I'd like to write a journal entry freely. Please start with a blank canvas.";
    }
    return initialPrompt ? initialPrompt : getInitialMessage('journal');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      {initializing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Preparing your journal session...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-2">Unable to start journal session</p>
          <p className="text-gray-500 text-center mb-4">{error}</p>
          <button
            onClick={handleReloadPage}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ChatInterface 
          type="journal" 
          onBack={onBack}
          initialMessage={getCustomInitialMessage()}
          onEndChat={handleEndChat}
          onError={handleError}
          saveChat={true}
        />
      )}
    </div>
  );
};
