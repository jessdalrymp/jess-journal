
import React, { useRef, useEffect, memo } from 'react';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '../ui/scroll-area';
import { extractFormattedContent } from '@/utils/contentParser';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

// Memoize the component to prevent unnecessary re-renders
export const ChatMessageList = memo(({ messages }: ChatMessageListProps) => {
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
  
  // Function to process message content and handle JSON formatting
  const processMessageContent = (content: string, isAssistant: boolean) => {
    // For assistant messages, try to render markdown
    if (isAssistant) {
      return (
        <ReactMarkdown 
          className="prose prose-sm max-w-none dark:prose-invert leading-tight"
        >
          {addSpacesBetweenNumbers(content)}
        </ReactMarkdown>
      );
    }
    
    // For user messages, handle JSON content specially
    const jsonContent = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonContent) {
      try {
        const parsedJson = JSON.parse(jsonContent[1]);
        // If it's a brevity preference message, just show the actual message
        if (parsedJson.message && parsedJson.brevity) {
          return <div className="whitespace-pre-wrap">{addSpacesBetweenNumbers(parsedJson.message)}</div>;
        }
      } catch (e) {
        // If parsing fails, just display the regular content
      }
    }
    
    // Default: just display the content as-is
    return <div className="whitespace-pre-wrap">{addSpacesBetweenNumbers(content)}</div>;
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
            {/* Display JESS label for assistant messages */}
            {msg.role === 'assistant' && (
              <div className="text-xs text-jess-primary font-semibold mb-1">JESS</div>
            )}
            {processMessageContent(msg.content, msg.role === 'assistant')}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
});

// Add display name for debugging purposes
ChatMessageList.displayName = 'ChatMessageList';
