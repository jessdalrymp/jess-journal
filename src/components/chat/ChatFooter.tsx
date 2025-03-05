
import React from 'react';
import { LogOut } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

interface ChatFooterProps {
  onEndChat: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
}

export const ChatFooter = ({ onEndChat, type }: ChatFooterProps) => {
  return (
    <div className="p-4 border-t border-jess-subtle flex justify-center">
      <ActionButton 
        onClick={onEndChat}
        type="primary"
        className="shadow-md px-6 py-3 text-base"
        icon={<LogOut className="h-5 w-5" />}
      >
        {type === 'sideQuest' ? 'Save & Exit' : 'Leave Conversation'}
      </ActionButton>
    </div>
  );
};
