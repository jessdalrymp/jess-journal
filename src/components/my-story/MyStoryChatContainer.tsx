
import { useState, useEffect } from "react";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { getInitialMessage } from "../../components/chat/chatUtils";
import { Loader2 } from "lucide-react";

interface MyStoryChatContainerProps {
  onBack: () => void;
  onSave: () => void;
  conversationId: string | null;
}

export const MyStoryChatContainer = ({ 
  onBack, 
  onSave, 
  conversationId 
}: MyStoryChatContainerProps) => {
  const [initializing, setInitializing] = useState(!!conversationId);
  
  // Give a short delay when loading existing conversations to allow initialization
  useEffect(() => {
    if (conversationId) {
      const timer = setTimeout(() => {
        setInitializing(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setInitializing(false);
    }
  }, [conversationId]);

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      {initializing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading your conversation...</p>
        </div>
      ) : (
        <ChatInterface 
          type="story" 
          onBack={onBack} 
          initialMessage={getInitialMessage('story')} 
          onEndChat={onSave}
          saveChat
          conversationId={conversationId}
        />
      )}
    </div>
  );
};
