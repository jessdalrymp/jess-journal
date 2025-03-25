
import { useState, useEffect, useCallback } from 'react';
import { useInitializeChat } from './useInitializeChat';
import { useSendMessage } from './useSendMessage';
import { useAuth } from '@/context/AuthContext';
import type { ChatMessage, ConversationSession } from '@/lib/types';

export const useConversationHandling = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onBack: () => void,
  initialMessage?: string,
  conversationId?: string | null,
  onEndChat?: () => void,
  onRestart?: () => void,
  persistConversation = false
) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  const { user, authLoading } = useAuth();
  
  // Initialize chat session
  const { session, loading, error, setSession } = useInitializeChat(type, initialMessage, conversationId);
  
  // Configure message sending
  const sendMessage = useSendMessage(session, setSession, type);
  
  // Handle opening the end dialog
  const openEndDialog = useCallback((saveChat: boolean = false) => {
    console.log("Opening end dialog with saveChat =", saveChat);
    if (saveChat && onEndChat) {
      console.log("Save chat requested, calling onEndChat directly");
      onEndChat();
    } else {
      console.log("Regular end dialog requested");
      setShowEndDialog(true);
    }
  }, [onEndChat]);
  
  // Handle ending the conversation
  const handleEndConversation = useCallback(() => {
    console.log("Handling end conversation request");
    setShowEndDialog(false);
    
    if (onEndChat) {
      console.log("Calling onEndChat callback");
      onEndChat();
    } else {
      console.log("No onEndChat callback provided, just going back");
      onBack();
    }
  }, [onBack, onEndChat]);
  
  // Handle journaling completion
  const handleJournalingComplete = useCallback(() => {
    console.log("Handling journaling completion");
    setShowJournalingDialog(false);
    onBack();
  }, [onBack]);
  
  // Handle new challenge request
  const handleNewChallenge = useCallback(() => {
    console.log("Handling new challenge request");
    if (onRestart) {
      onRestart();
    }
  }, [onRestart]);
  
  return {
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
  };
};
