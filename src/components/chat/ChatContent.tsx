
import React, { useRef, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatFooter } from './ChatFooter';
import { ConversationSession } from '@/lib/types';

interface ChatContentProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  session: ConversationSession;
  loading: boolean;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  onEndChat: () => void;
  onSaveAndExit?: () => void;
  onAcceptChallenge?: () => void;
  onNewChallenge?: () => void;
  saveChat?: boolean;
}

export const ChatContent = ({
  type,
  session,
  loading,
  onBack,
  onSendMessage,
  onEndChat,
  onSaveAndExit,
  onAcceptChallenge,
  onNewChallenge,
  saveChat = false
}: ChatContentProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <ChatMessageList 
          messages={session.messages} 
        />
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={loading}
        scrollToBottom={scrollToBottom}
      />
      <ChatFooter
        type={type}
        onEndChat={onEndChat}
        onSaveAndExit={onSaveAndExit}
        onAcceptChallenge={onAcceptChallenge}
        onNewChallenge={onNewChallenge}
        saveChat={saveChat}
      />
    </div>
  );
};
