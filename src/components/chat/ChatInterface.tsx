
import React from 'react';
import { useChat } from './useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatInterface = ({ type, onBack }: ChatInterfaceProps) => {
  const { session, loading, sendMessage } = useChat(type);
  
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex items-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Loading conversation...
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader type={type} onBack={onBack} />
      <ChatMessageList messages={session.messages} />
      {loading && (
        <div className="px-4 py-2 bg-gray-50 border-t border-jess-subtle">
          <div className="flex items-center text-sm text-gray-500">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Jess is thinking...
          </div>
        </div>
      )}
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
};
