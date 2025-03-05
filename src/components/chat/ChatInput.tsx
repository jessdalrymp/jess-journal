
import React, { useState } from 'react';
import { ActionButton } from '../ui/ActionButton';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

export const ChatInput = ({ onSendMessage, loading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (!message.trim() || loading) return;
    onSendMessage(message);
    setMessage('');
  };
  
  return (
    <div className="border-t border-jess-subtle p-4">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 input-base"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <ActionButton
          type="primary"
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center"
          icon={<Send size={18} />}
        >
          <span className="sr-only">Send</span>
        </ActionButton>
      </div>
    </div>
  );
};
