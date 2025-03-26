
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
    handleNewChallenge,
    generateSummary
  } = useConversationHandling(
    type, 
    onBack, 
    initialMessage,
    conversationId,
    onEndChat,
    onRestart,
    persistConversation
  );
  
  // New function to handle save and exit
  const handleSaveAndExit = async () => {
    if (!session || !user) return;
    
    try {
      const summary = await generateSummary();
      if (summary) {
        console.log("Generated summary before exiting:", summary);
      }
      // Navigate to index page
      navigate('/');
    } catch (error) {
      console.error("Error saving and exiting:", error);
      if (onError) {
        onError("Failed to save conversation summary");
      }
    }
  };
  
  // Report errors back to parent if needed
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
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
    return <ChatErrorState type={type} onBack={onBack} error={error} />;
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
        onSaveAndExit={handleSaveAndExit}
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
