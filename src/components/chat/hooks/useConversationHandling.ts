
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '../useChat';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { clearCurrentConversationFromStorage } from '@/lib/storageUtils';

export const useConversationHandling = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onBack: () => void,
  initialMessage?: string,
  conversationId?: string | null,
  onEndChat?: () => void,
  onRestart?: () => void,
  persistConversation: boolean = false
) => {
  const { user, loading: authLoading } = useAuth();
  const { session, loading, error, sendMessage: chatSendMessage, generateSummary, saveJournalEntryFromChat } = useChat(type, initialMessage, conversationId);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle sending a message with brevity option
  const sendMessage = useCallback((message: string, options?: { brevity?: 'short' | 'detailed' }) => {
    if (!session) {
      console.error("Cannot send message: No active session");
      return;
    }
    
    // Add brevity info to the message context
    const brevityParameter = options?.brevity || 'detailed';
    let messageToSend = message;
    
    // Only modify the API call, not the displayed message
    const messageContext = {
      brevity: brevityParameter,
      message
    };
    
    // Pass the JSON as the actual message
    chatSendMessage(JSON.stringify(messageContext));
  }, [session, chatSendMessage]);

  // Clean up conversation storage when navigating away
  useEffect(() => {
    return () => {
      // Only clear if not persisting
      if (!persistConversation) {
        clearCurrentConversationFromStorage(type);
      }
    };
  }, [type, persistConversation]);

  // Open the end dialog
  const openEndDialog = (save: boolean = false) => {
    if (type === 'journal') {
      setShowJournalingDialog(true);
    } else {
      setShowEndDialog(true);
    }
  };

  // Handle ending the conversation
  const handleEndConversation = async (saveToJournal: boolean = false) => {
    try {
      if (saveToJournal) {
        const summary = await generateSummary();
        console.log("Summary generated:", summary);
        toast({
          title: `${type === 'story' ? 'Story' : 'Side Quest'} Saved`,
          description: `Your conversation has been summarized and saved to your journal.`,
        });
      }
      
      if (!persistConversation) {
        clearCurrentConversationFromStorage(type);
      }
      
      if (onEndChat) {
        onEndChat();
      } else {
        onBack();
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
      toast({
        title: "Error",
        description: "There was a problem ending your conversation.",
        variant: "destructive",
      });
    }
  };

  // Handle completing journaling
  const handleJournalingComplete = async (saveEntry: boolean = false) => {
    if (saveEntry && type === 'journal') {
      try {
        const result = await saveJournalEntryFromChat();
        console.log("Journal entry saved:", result);
        toast({
          title: "Journal Entry Saved",
          description: "Your journal entry has been saved successfully.",
        });
      } catch (error) {
        console.error("Error saving journal entry:", error);
        toast({
          title: "Error",
          description: "There was a problem saving your journal entry.",
          variant: "destructive",
        });
      }
    }
    
    if (!persistConversation) {
      clearCurrentConversationFromStorage(type);
    }
    
    // If we have a restart handler, use it, otherwise default to back
    if (onRestart) {
      onRestart();
    } else {
      onBack();
    }
  };

  // Handle creating a new challenge
  const handleNewChallenge = () => {
    clearCurrentConversationFromStorage(type);
    window.location.reload();
  };

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
