
import React, { useEffect, useState, useRef } from 'react';
import { useChat } from './useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatLoadingState } from './ChatLoadingState';
import { ChatErrorState } from './ChatErrorState';
import { ChatUnauthenticatedState } from './ChatUnauthenticatedState';
import { ChatEndDialog } from './ChatEndDialog';
import { ChatFooter } from './ChatFooter';
import { clearCurrentConversationFromStorage } from '@/lib/storageUtils';
import { JournalingDialog } from '../challenges/JournalingDialog';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  onAcceptChallenge?: () => void;
  onRestart?: () => void;
  onEndChat?: () => void;
  initialMessage?: string;
  saveChat?: boolean;
  conversationId?: string | null;
}

export const ChatInterface = ({ 
  type, 
  onBack, 
  onAcceptChallenge, 
  onRestart,
  onEndChat,
  initialMessage,
  saveChat = false,
  conversationId = null
}: ChatInterfaceProps) => {
  const { user, loading: authLoading } = useAuth();
  const { session, loading: chatLoading, error, sendMessage, generateSummary, saveJournalEntryFromChat } = useChat(type, initialMessage, conversationId);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  const chatInitialized = useRef(false);
  const { toast } = useToast();
  
  const loading = authLoading || chatLoading;
  
  useEffect(() => {
    if (error && error.includes('authentication')) {
      console.log('Authentication error detected in ChatInterface:', error);
    }
    
    // Set chatInitialized to true once we get a session
    if (session && !chatInitialized.current) {
      chatInitialized.current = true;
      
      // Log session info for debugging
      console.log(`ChatInterface received session for ${type} with ${session.messages?.length || 0} messages`);
      if (session.messages && session.messages.length > 0) {
        console.log(`First message role: ${session.messages[0].role}, content: ${session.messages[0].content?.substring(0, 50)}...`);
      }
    }
    
    return () => {
      console.log(`ChatInterface unmounting for ${type}`);
    };
  }, [error, type, session]);

  const openEndDialog = () => {
    if (saveChat && onEndChat) {
      onEndChat();
    } else if (type === 'journal') {
      // For journal type, open the journaling dialog instead of the end dialog
      setShowJournalingDialog(true);
    } else if (type === 'sideQuest') {
      handleEndConversation();
    } else {
      setShowEndDialog(true);
    }
  };

  const handleEndConversation = async () => {
    setShowEndDialog(false);
    
    try {
      if (session && session.messages.length > 2) {
        if (type === 'story' || type === 'sideQuest') {
          toast({
            title: "Saving conversation...",
            description: "We're storing your progress to journal history.",
          });
          await generateSummary();
        } else if (type === 'journal') {
          toast({
            title: "Saving journal entry...",
            description: "We're saving your journal to history.",
          });
          await saveJournalEntryFromChat();
        }
      }
      
      onBack();
    } catch (error) {
      console.error('Error ending conversation:', error);
      toast({
        title: "Error saving conversation",
        description: "There was a problem saving your progress.",
        variant: "destructive"
      });
      onBack();
    }
  };

  const handleJournalingComplete = () => {
    setShowJournalingDialog(false);
    onBack();
  };

  const handleNewChallenge = () => {
    if (onRestart) {
      onRestart();
    } else {
      clearCurrentConversationFromStorage(type);
      toast({
        title: "New challenge requested",
        description: "Generating a new action challenge for you...",
      });
      window.location.reload();
    }
  };

  if (authLoading) {
    return <ChatLoadingState type={type} onBack={onBack} />;
  }
  
  if (!user) {
    return <ChatUnauthenticatedState type={type} onBack={onBack} />;
  }
  
  if (chatLoading && !session) {
    return <ChatLoadingState type={type} onBack={onBack} />;
  }
  
  if (error) {
    return <ChatErrorState type={type} onBack={onBack} error={error} />;
  }
  
  if (!session) {
    return (
      <div className="h-full flex flex-col">
        <ChatHeader type={type} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-gray-500">Initializing conversation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract the first message content (which is the prompt) for journal entry
  const promptText = session.messages.length > 0 ? session.messages[0].content : undefined;
  
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
      <ChatInput onSendMessage={sendMessage} loading={loading} />
      <ChatFooter 
        onEndChat={openEndDialog} 
        type={type} 
        onAcceptChallenge={onAcceptChallenge}
        onNewChallenge={type === 'action' || type === 'journal' ? handleNewChallenge : undefined} 
        saveChat={saveChat}
      />
      {!saveChat && (
        <ChatEndDialog 
          open={showEndDialog} 
          onOpenChange={setShowEndDialog} 
          onEndConversation={handleEndConversation} 
        />
      )}
      
      {type === 'journal' && (
        <JournalingDialog
          open={showJournalingDialog}
          onOpenChange={setShowJournalingDialog}
          challengeType="journal"
          promptText={promptText}
        />
      )}
    </div>
  );
};
