
import React, { useState, useEffect, useCallback } from 'react';
import { useConversationHandling } from './hooks/useConversationHandling';
import { 
  ChatLoadingState, 
  ChatUnauthenticatedState, 
  ChatErrorState, 
  ChatInitializing 
} from './ChatStateComponents';
import { ChatContent } from './ChatContent';
import { ChatDialogs } from './ChatDialogs';

interface ChatInterfaceProps {
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  onBack: () => void;
  onAcceptChallenge?: () => void;
  onRestart?: () => void;
  onEndChat?: () => void;
  onError?: (error: string) => void;
  initialMessage?: string;
  saveChat?: boolean;
  persistConversation?: boolean;
  conversationId?: string | null;
}

export const ChatInterface = ({ 
  type, 
  onBack, 
  onAcceptChallenge, 
  onRestart,
  onEndChat,
  onError,
  initialMessage,
  saveChat = false,
  persistConversation = false,
  conversationId = null
}: ChatInterfaceProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [authRetried, setAuthRetried] = useState(false);
  
  const {
    user,
    session,
    loading,
    error,
    authLoading,
    sendMessage,
    showEndDialog,
    setShowEndDialog,
    showJournalingDialog,
    setShowJournalingDialog,
    openEndDialog,
    handleEndConversation,
    handleJournalingComplete,
    handleNewChallenge
  } = useConversationHandling(
    type, 
    onBack, 
    initialMessage,
    conversationId,
    onEndChat,
    onRestart,
    persistConversation,
    retryCount // Pass retry count to force re-initialization
  );
  
  // Auto-retry once for authentication errors
  useEffect(() => {
    if (error && error.includes('User not authenticated') && !authRetried) {
      console.log('Detected auth error, attempting auto-retry...');
      setAuthRetried(true);
      const timer = setTimeout(() => {
        console.log('Executing auto-retry for auth error');
        setRetryCount(prev => prev + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [error, authRetried]);
  
  // Report errors back to parent if needed
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
  const handleRetry = useCallback(() => {
    console.log('Manually retrying conversation initialization...');
    setAuthRetried(false); // Reset auth retry flag
    setRetryCount(prev => prev + 1);
  }, []);
  
  if (authLoading) {
    return <ChatLoadingState type={type} onBack={onBack} />;
  }
  
  if (!user) {
    return <ChatUnauthenticatedState type={type} onBack={onBack} />;
  }
  
  if (loading && !session) {
    return <ChatLoadingState type={type} onBack={onBack} />;
  }
  
  if (error) {
    return <ChatErrorState type={type} onBack={onBack} error={error} onRetry={handleRetry} />;
  }
  
  if (!session) {
    return <ChatInitializing type={type} onBack={onBack} />;
  }
  
  // Extract the first message content (which is the prompt) for journal entry
  const promptText = session.messages.length > 0 ? session.messages[0].content : undefined;
  
  return (
    <>
      <ChatContent
        type={type}
        session={session}
        loading={loading}
        onBack={onBack}
        onSendMessage={sendMessage}
        onEndChat={() => openEndDialog(saveChat)}
        onAcceptChallenge={onAcceptChallenge}
        onNewChallenge={type === 'action' || type === 'journal' ? handleNewChallenge : undefined}
        saveChat={saveChat}
      />
      
      <ChatDialogs
        type={type}
        showEndDialog={showEndDialog}
        setShowEndDialog={setShowEndDialog}
        onEndConversation={handleEndConversation}
        showJournalingDialog={showJournalingDialog}
        setShowJournalingDialog={setShowJournalingDialog}
        promptText={promptText}
        saveChat={saveChat}
        persistConversation={persistConversation}
      />
    </>
  );
};
