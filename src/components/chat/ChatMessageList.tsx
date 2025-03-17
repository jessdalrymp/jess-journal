
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '../ui/scroll-area';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-400">
        No messages yet
      </div>
    );
  }
  
  // Function to add spaces between numbers in text
  const addSpacesBetweenNumbers = (text: string) => {
    return text.replace(/(\d)(?=\d)/g, '$1 ');
  };
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 bg-white">
        {messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'} p-3 rounded-lg mb-2 ${
              msg.role === 'user' ? 'bg-jess-primary bg-opacity-10 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'
            } leading-tight`}
          >
            {msg.role === 'assistant' ? (
              <ReactMarkdown 
                className="prose prose-sm max-w-none dark:prose-invert leading-tight"
              >
                {addSpacesBetweenNumbers(msg.content)}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{addSpacesBetweenNumbers(msg.content)}</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
