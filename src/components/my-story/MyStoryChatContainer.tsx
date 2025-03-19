
import { useState, useEffect } from "react";
import { ChatInterface } from "../../components/chat/ChatInterface";
import { ChatErrorState } from "../../components/chat/ChatErrorState";
import { getInitialMessage } from "../../components/chat/chatUtils";
import { Loader2 } from "lucide-react";
import { getCurrentConversationFromStorage } from "@/lib/storageUtils";
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
  const [hasExistingMessages, setHasExistingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if there's an existing conversation with messages
  useEffect(() => {
    if (conversationId) {
      try {
        const existingConversation = getCurrentConversationFromStorage('story');
        if (existingConversation && existingConversation.messages && existingConversation.messages.length > 0) {
          console.log(`Found existing story conversation with ${existingConversation.messages.length} messages`);
          setHasExistingMessages(true);
          setError(null); // Clear any previous errors
        } else {
          console.log('No messages found in existing story conversation');
        }
      } catch (error) {
        console.error('Error checking for existing messages:', error);
        setError('Error loading conversation data');
        toast({
          title: "Error loading conversation",
          description: "There was a problem loading your previous conversation.",
          variant: "destructive"
        });
      }
      
      // Shorter initialization delay for better UX
      const timer = setTimeout(() => {
        setInitializing(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setInitializing(false);
    }
  }, [conversationId, toast]);

  // Custom handler to ensure we don't clear the story conversation when leaving the page
  const handleEndChat = () => {
    // Instead of clearing, we'll make sure to save
    onSave(true); // Pass true to indicate need for refresh
  };

  // Determine the initial message: empty for continuing conversations or welcome for new ones
  const getAppropriateInitialMessage = () => {
    if (hasExistingMessages) {
      // If there are existing messages, don't add an initial message
      return "";
    }
    // Otherwise return the standard initial message
    return getInitialMessage('story');
  };

  // Handle errors in rendering
  const handleChatError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Error loading conversation",
      description: errorMessage,
      variant: "destructive"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      {initializing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading your previous conversation...</p>
        </div>
      ) : error ? (
        <ChatErrorState 
          type="story" 
          onBack={onBack} 
          error={error} 
        />
      ) : (
        <ChatInterface 
          type="story" 
          onBack={onBack} 
          initialMessage={getAppropriateInitialMessage()} 
          onEndChat={handleEndChat}
          saveChat
          conversationId={conversationId}
          continuousChat={true}
          onError={handleChatError}
        />
      )}
    </div>
  );
};
