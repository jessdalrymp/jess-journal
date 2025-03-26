
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCheck, Save, X, Sparkles } from 'lucide-react';

interface ChatFooterProps {
  onEndChat: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  saveChat?: boolean;
}

export const ChatFooter = ({ 
  onEndChat, 
  type, 
  onAcceptChallenge, 
  onNewChallenge,
  saveChat = false
}: ChatFooterProps) => {
  const handleEndChatClick = () => {
    console.log("End chat button clicked in ChatFooter, saveChat =", saveChat);
    // Directly call onEndChat without any additional logic
    onEndChat();
  };

  return (
    <div className="p-3 bg-white border-t border-jess-subtle flex justify-between">
      {(type === 'action') && onAcceptChallenge && (
        <Button
          onClick={onAcceptChallenge}
          variant="default"
          className="text-sm"
        >
          <CheckCheck size={16} className="mr-1" />
          Accept Challenge
        </Button>
      )}
      
      {onNewChallenge && (
        <Button
          onClick={onNewChallenge}
          variant="outline"
          className="text-sm"
        >
          <Sparkles size={16} className="mr-1" />
          New Challenge
        </Button>
      )}
      
      <div className="ml-auto">
        <Button 
          onClick={handleEndChatClick}
          variant={saveChat ? "default" : "outline"}
          className={`text-sm ${saveChat ? "bg-jess-primary hover:bg-jess-primary/90" : ""}`}
        >
          {saveChat ? (
            <>
              <Save size={16} className="mr-1" />
              Save & Close
            </>
          ) : (
            <>
              <X size={16} className="mr-1" />
              Close
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
