
import { useState, useEffect } from "react";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { getInitialMessage } from "../../components/chat/chatUtils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MyStoryChatContainerProps {
  onBack: () => void;
  onSave: (refreshData?: boolean) => void;
  conversationId: string | null;
}

export const MyStoryChatContainer = ({ 
  onBack, 
  onSave, 
  conversationId 
}: MyStoryChatContainerProps) => {
  const [initializing, setInitializing] = useState(!!conversationId);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Give a short delay when loading existing conversations to allow initialization
  useEffect(() => {
    if (conversationId) {
      console.log("Initializing with existing conversation ID:", conversationId);
      const timer = setTimeout(() => {
        setInitializing(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Starting new conversation");
      setInitializing(false);
    }
  }, [conversationId]);

  const handleError = (errorMessage: string) => {
    console.error("Chat error:", errorMessage);
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Error loading conversation",
      description: errorMessage || "Failed to load the conversation. Please try again.",
    });
  };

  const handleEndChat = () => {
    console.log("Ending chat and saving to journal from MyStoryChatContainer");
    toast({
      title: "Saving your story",
      description: "Preparing to save your conversation to your journal"
    });
    
    // Call onSave with true to indicate refresh is needed
    onSave(true);
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      {initializing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading your conversation...</p>
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
          <p className="text-gray-700 font-medium mb-2">Unable to load conversation</p>
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
          type="story" 
          onBack={onBack} 
          initialMessage={getInitialMessage('story')} 
          onEndChat={handleEndChat}
          onError={handleError}
          saveChat={true}
          persistConversation={true} // Keep conversation after saving
          conversationId={conversationId}
        />
      )}
    </div>
  );
}
