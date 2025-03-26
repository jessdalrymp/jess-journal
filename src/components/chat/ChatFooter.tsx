
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCheck, Save, Sparkles } from 'lucide-react';

interface ChatFooterProps {
  onEndChat: () => void;
  onSaveAndExit?: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  saveChat?: boolean;
}

export const ChatFooter = ({ 
  onEndChat, 
  onSaveAndExit,
  type, 
  onAcceptChallenge, 
  onNewChallenge,
  saveChat = false
}: ChatFooterProps) => {
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
      
      <div className="ml-auto flex gap-2">
        {onSaveAndExit && (
          <Button 
            onClick={onSaveAndExit} 
            variant="default"
            className="text-sm"
          >
            <Save size={16} className="mr-1" />
            Save & Exit
          </Button>
        )}
        <Button 
          onClick={onEndChat} 
          variant="outline"
          className="text-sm"
        >
          {saveChat ? (
            <>
              <Save size={16} className="mr-1" />
              Save Chat
            </>
          ) : (
            <>End Chat</>
          )}
        </Button>
      </div>
    </div>
  );
};
