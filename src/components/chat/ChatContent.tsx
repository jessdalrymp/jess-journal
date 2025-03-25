
import React from 'react';
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
  onSendMessage: (message: string, options?: { brevity?: 'short' | 'detailed' }) => void;
  onEndChat?: () => void;
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
  onAcceptChallenge,
  onNewChallenge,
  saveChat
}: ChatContentProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader
        type={type}
        onBack={onBack}
        onEndChat={onEndChat}
        onAcceptChallenge={onAcceptChallenge}
        onNewChallenge={onNewChallenge}
        saveChat={saveChat}
      />
      <div className="flex-1 overflow-hidden">
        <ChatMessageList messages={session.messages} />
      </div>
      <ChatInput onSendMessage={onSendMessage} loading={loading} />
      {onEndChat && (
        <ChatFooter 
          type={type} 
          onEndChat={onEndChat} 
          onAcceptChallenge={onAcceptChallenge}
          onNewChallenge={onNewChallenge}
          saveChat={saveChat}
        />
      )}
    </div>
  );
};
