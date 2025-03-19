
import React, { useState, useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageDisplay } from './ChatMessageDisplay';
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

      <ChatMessageDisplay 
        messages={session?.messages || []} 
        loading={chatLoading} 
        error={chatError} 
        chatBottomRef={chatBottomRef}
      />

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
