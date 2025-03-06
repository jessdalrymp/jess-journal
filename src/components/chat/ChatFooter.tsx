
import React from 'react';
import { LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

interface ChatFooterProps {
  onEndChat: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
}

export const ChatFooter = ({ onEndChat, type, onAcceptChallenge, onNewChallenge }: ChatFooterProps) => {
  return (
    <div className="p-4 border-t border-jess-subtle flex justify-center gap-4">
      {type === 'action' && (
        <>
          {onAcceptChallenge && (
            <ActionButton 
              onClick={onAcceptChallenge}
              type="primary"
              className="shadow-md px-6 py-3 text-base"
              icon={<CheckCircle className="h-5 w-5" />}
            >
              Accept Challenge
            </ActionButton>
          )}
          
          {onNewChallenge && (
            <ActionButton 
              onClick={onNewChallenge}
              type="secondary"
              className="shadow-md px-6 py-3 text-base"
              icon={<RefreshCw className="h-5 w-5" />}
            >
              Get New Challenge
            </ActionButton>
          )}
        </>
      )}
      
      <ActionButton 
        onClick={onEndChat}
        type={type === 'action' && (onAcceptChallenge || onNewChallenge) ? "ghost" : "primary"}
        className="shadow-md px-6 py-3 text-base"
        icon={<LogOut className="h-5 w-5" />}
      >
        {type === 'sideQuest' ? 'Save & Exit' : 'Save and Go Home'}
      </ActionButton>
    </div>
  );
};
