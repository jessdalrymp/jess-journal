
import React from 'react';
import { Loader2 } from 'lucide-react';
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
  saveChat = false
}: ChatContentProps) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <ChatHeader type={type} onBack={onBack} />
      <div className="flex-1 relative overflow-hidden">
        <ChatMessageList messages={session.messages || []} />
        {loading && (
          <div className="px-4 py-2 bg-gray-100 border-t border-jess-subtle flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
            <span className="text-sm font-medium">Jess is thinking...</span>
          </div>
        )}
      </div>
      <ChatInput onSendMessage={onSendMessage} loading={loading} />
      <ChatFooter 
        onEndChat={onEndChat} 
        type={type} 
        onAcceptChallenge={onAcceptChallenge}
        onNewChallenge={onNewChallenge} 
        saveChat={saveChat}
      />
    </div>
  );
};
