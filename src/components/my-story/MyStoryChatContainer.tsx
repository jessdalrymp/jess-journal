
import { useState, useEffect } from "react";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { getInitialMessage } from "../../components/chat/chatUtils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";

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
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { fetchJournalEntries } = useUserData();
  
  // Give a short delay when loading existing conversations to allow initialization
  useEffect(() => {
    console.log("MyStoryChatContainer: Initializing with conversation ID:", conversationId);
    
    // Always show loading state briefly to ensure proper initialization
    const timer = setTimeout(() => {
      setInitializing(false);
    }, conversationId ? 2000 : 1000);
    
    return () => clearTimeout(timer);
  }, [conversationId]);

  const handleEndChat = async () => {
    try {
      console.log("Ending chat and saving data");
      // Call onSave with true to indicate need for refresh
      onSave(true);
      
      // Explicit journal refresh to ensure latest data is available
      await fetchJournalEntries();
      
      // Show success toast
      toast({
        title: "Story saved",
        description: "Your story has been saved to your journal history.",
      });
    } catch (error) {
      console.error("Error saving chat:", error);
      setError("Failed to save your story. Please try again.");
      toast({
        title: "Error saving story",
        description: "There was a problem saving your story. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setInitializing(true);
    // Force a refresh by triggering the loading state again
    setTimeout(() => {
      setInitializing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      {initializing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">
            {conversationId 
              ? "Loading your previous conversation..." 
              : "Setting up a new conversation..."}
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : (
        <ChatInterface 
          type="story" 
          onBack={onBack} 
          initialMessage={getInitialMessage('story')} 
          onEndChat={handleEndChat}
          saveChat={true}
          conversationId={conversationId}
        />
      )}
    </div>
  );
};
