
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { clearCurrentConversationFromStorage } from '@/lib/storageUtils';
import { useChat } from '../useChat';

/**
 * Hook to handle conversation logic for the chat interface
 */
export const useConversationHandling = (
  type: 'story' | 'sideQuest' | 'action' | 'journal',
  onBack: () => void,
  initialMessage?: string,
  conversationId?: string | null,
  onEndChat?: () => void,
  onRestart?: () => void,
  persistConversation: boolean = false
) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showJournalingDialog, setShowJournalingDialog] = useState(false);
  const chatInitialized = useRef(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const { 
    session, 
    loading: chatLoading, 
    error, 
    sendMessage, 
    generateSummary, 
    saveJournalEntryFromChat 
  } = useChat(type, initialMessage, conversationId);
  
  const loading = authLoading || chatLoading;

  // Set chatInitialized to true once we get a session
  if (session && !chatInitialized.current) {
    chatInitialized.current = true;
    
    // Log session info for debugging
    console.log(`ChatInterface received session for ${type} with ${session.messages?.length || 0} messages`);
    if (session.messages && session.messages.length > 0) {
      console.log(`First message role: ${session.messages[0].role}, content: ${session.messages[0].content?.substring(0, 50)}...`);
    }
  }

  const openEndDialog = (saveChat?: boolean) => {
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
      
      // Only clear conversation if not persisting and we're ending the chat
      if (!persistConversation && type === 'story') {
        console.log("Not clearing story conversation due to persistConversation=true");
      } else if (type !== 'story') {
        // For other types, still clear conversation
        clearCurrentConversationFromStorage(type);
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

  return {
    user,
    session,
    loading,
    error,
    authLoading,
    chatLoading,
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
