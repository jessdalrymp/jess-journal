
import React from 'react';
import { Save } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

interface ChatFooterProps {
  onEndChat: () => void;
}

export const ChatFooter = ({ onEndChat }: ChatFooterProps) => {
  return (
    <div className="p-4 border-t border-jess-subtle flex justify-center">
      <ActionButton 
        onClick={onEndChat}
        type="primary"
        className="shadow-md px-6 py-3 text-base"
        icon={<Save className="h-5 w-5" />}
      >
        Leave Conversation
      </ActionButton>
    </div>
  );
};
