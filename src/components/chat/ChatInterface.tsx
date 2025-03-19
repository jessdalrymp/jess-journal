
import React, { useState, useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { useChat } from './useChat';
import { ChatDialogs } from './ChatDialogs';
import { useJournalPrompt } from '@/hooks/useJournalPrompt';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInterfaceProps {
  onBack?: () => void;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  initialMessage?: string;
  onEndChat?: () => void;
  saveChat?: boolean;
  conversationId?: string | null;
}

export const ChatInterface = ({
  onBack = () => {},
  type,
  initialMessage,
  onEndChat,
  saveChat = false,
  conversationId
}: ChatInterfaceProps) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  const [promptText, setPromptText] = useState<string | undefined>(undefined);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Fixed destructuring to match what useJournalPrompt actually returns
  const { journalPrompt, isLoading: promptLoading } = useJournalPrompt();

  useEffect(() => {
    if (journalPrompt && type === 'journal') {
      setPromptText(journalPrompt.prompt);
      localStorage.setItem('currentJournalPrompt', JSON.stringify(journalPrompt));
    }
  }, [journalPrompt, type]);

  const {
    session,
    loading: chatLoading,
    error: chatError,
    sendMessage,
    generateSummary
  } = useChat(type, initialMessage, conversationId);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [session?.messages]);

  const handleEndChat = async () => {
    if (saveChat && session) {
      try {
        // Generate summary before ending chat
        await generateSummary();
        console.log("Summary generated successfully before ending chat");
      } catch (error) {
        console.error("Error generating summary:", error);
      }
    }
    
    if (onEndChat) {
      onEndChat();
    }
    
    setShowEndDialog(false);
  };

  const handleSendMessage = (message: string) => {
    if (session) {
      sendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        type={type}
        onBack={onBack} 
        onEnd={() => setShowEndDialog(true)} 
      />

      <div className="flex-1 overflow-y-auto bg-white">
        {session?.messages && session.messages.length > 0 && (
          <div className="px-4 py-4 space-y-6">
            {session.messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'assistant' 
                      ? 'bg-jess-subtle text-jess-foreground' 
                      : 'bg-jess-primary text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {chatLoading && (
          <div className="px-4 py-2 bg-gray-100 border-t border-jess-subtle flex items-center">
            <div className="h-5 w-5 mr-2 animate-spin border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="text-sm font-medium">Jess is thinking...</span>
          </div>
        )}
        
        {chatError && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600">
            <p>Something went wrong. Please try again.</p>
          </div>
        )}
        
        <div ref={chatBottomRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        loading={chatLoading}
        disabled={chatLoading}
        type={type}
        onJournal={() => setShowJournalingDialog(true)}
      />

      {/* Dialogs */}
      <ChatDialogs
        type={type}
        showEndDialog={showEndDialog}
        setShowEndDialog={setShowEndDialog}
        onEndConversation={handleEndChat}
        showJournalingDialog={showJournalingDialog}
        setShowJournalingDialog={setShowJournalingDialog}
        promptText={promptText}
        saveChat={saveChat}
        session={session}
      />
    </div>
  );
};
