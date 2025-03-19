
import { ChatInterface } from "../../components/chat/ChatInterface";
import { getInitialMessage } from "../../components/chat/chatUtils";

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
  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
      <ChatInterface 
        type="story" 
        onBack={onBack} 
        initialMessage={getInitialMessage('story')} 
        onEndChat={onSave}
        saveChat
        conversationId={conversationId}
      />
    </div>
  );
};
