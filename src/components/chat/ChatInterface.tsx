
import React from 'react';
import { useChat } from './useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
}

export const ChatInterface = ({ type, onBack }: ChatInterfaceProps) => {
  const { session, loading, sendMessage } = useChat(type);
  
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse">Loading conversation...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader type={type} onBack={onBack} />
      <ChatMessageList messages={session.messages} />
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
};
