
import { useState, useEffect } from "react";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { getInitialMessage } from "../../components/chat/chatUtils";
import { Loader2 } from "lucide-react";

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
  
  // Give a short delay when loading existing conversations to allow initialization
  useEffect(() => {
    console.log("MyStoryChatContainer: Initializing with conversation ID:", conversationId);
    
    // Always show loading state briefly to ensure proper initialization
    const timer = setTimeout(() => {
      setInitializing(false);
    }, conversationId ? 2000 : 1000);
    
    return () => clearTimeout(timer);
  }, [conversationId]);

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
      ) : (
        <ChatInterface 
          type="story" 
          onBack={onBack} 
          initialMessage={getInitialMessage('story')} 
          onEndChat={() => onSave(true)} // Pass true to indicate need for refresh
          saveChat
          conversationId={conversationId}
        />
      )}
    </div>
  );
};
