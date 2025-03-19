
import React, { RefObject } from 'react';
import { ChatMessage } from '@/lib/types';
import { ChatMessageList } from './ChatMessageList';
import { Loader2 } from 'lucide-react';

interface ChatMessageDisplayProps {
  messages: ChatMessage[];
  loading: boolean;
  error?: string | null;
  chatBottomRef: RefObject<HTMLDivElement>;
}

export const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({
  messages,
  loading,
  error,
  chatBottomRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <ChatMessageList messages={messages} />
      
      {loading && (
        <div className="px-4 py-2 bg-gray-100 border-t border-jess-subtle flex items-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
          <span className="text-sm font-medium">Jess is thinking...</span>
        </div>
      )}
      
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600">
          <p>Something went wrong. Please try again.</p>
        </div>
      )}
      
      <div ref={chatBottomRef} />
    </div>
  );
};
