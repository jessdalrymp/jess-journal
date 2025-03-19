
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '../useChat';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saveCurrentConversationToStorage, clearCurrentConversationFromStorage } from '@/lib/storageUtils';

export const useConversationHandling = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onBack: () => void,
  initialMessage?: string,
  conversationId?: string | null,
  onEndChat?: () => void,
  onRestart?: () => void,
  continuousChat: boolean = false
) => {
  const { user, loading: authLoading } = useAuth();
  const { session, loading, error, sendMessage, generateSummary, saveJournalEntryFromChat } = useChat(type, initialMessage, conversationId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  
  // Ensure current conversation is saved to storage whenever session updates
  useEffect(() => {
    if (session && continuousChat) {
      saveCurrentConversationToStorage(session);
    }
  }, [session, continuousChat]);
  
  const openEndDialog = useCallback((saveChat: boolean = false) => {
    if (saveChat) {
      if (onEndChat) {
        onEndChat();
      }
    } else {
      setShowEndDialog(true);
    }
  }, [onEndChat]);
  
  const handleEndConversation = useCallback(async () => {
    try {
      if (type === 'journal') {
        const summary = await saveJournalEntryFromChat();
        if (summary) {
          setShowJournalingDialog(true);
        } else {
          // No need to show journaling dialog, just navigate back
          if (!continuousChat) {
            clearCurrentConversationFromStorage(type);
          }
          onBack();
        }
      } else {
        if (onEndChat) {
          onEndChat();
        } else {
          if (!continuousChat) {
            clearCurrentConversationFromStorage(type);
          }
          
          if (onRestart) {
            onRestart();
          } else {
            onBack();
          }
        }
      }
    } catch (error) {
      console.error(`Error ending ${type} conversation:`, error);
      toast({
        title: 'Error',
        description: 'Could not end conversation properly. Please try again.',
        variant: 'destructive',
      });
    }
  }, [type, onBack, onEndChat, onRestart, saveJournalEntryFromChat, toast, continuousChat]);
  
  const handleJournalingComplete = useCallback(() => {
    setShowJournalingDialog(false);
    
    if (!continuousChat) {
      clearCurrentConversationFromStorage(type);
    }
    
    onBack();
  }, [type, onBack, continuousChat]);
  
  const handleNewChallenge = useCallback((challengeId: string) => {
    if (type === 'journal') {
      navigate(`/journal-challenge/${challengeId}`);
    } else if (type === 'action') {
      navigate(`/action-challenge/${challengeId}`);
    }
  }, [type, navigate]);
  
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
