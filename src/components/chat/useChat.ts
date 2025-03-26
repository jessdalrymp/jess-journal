
import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useInitializeChat } from './hooks/useInitializeChat';
import { useSendMessage } from './hooks/useSendMessage';
import { useGenerateSummary } from './hooks/useGenerateSummary';
import { useToast } from '@/hooks/use-toast';

export const useChat = (
  type: 'story' | 'sideQuest' | 'action' | 'journal', 
  initialMessage?: string,
  conversationId?: string | null
) => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const initializationAttempted = useRef(false);
  const initialMessageRef = useRef(initialMessage);
  const { toast } = useToast();
  
  const { user } = useAuth();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  
  const loading = initLoading || sendLoading || summaryLoading;
  const error = initError;
  
  // Store initialMessage in ref to avoid dependency issues
  useEffect(() => {
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);
  
  // Initialize chat session when user is authenticated
  useEffect(() => {
    // Only load chat if user exists and we haven't attempted initialization yet
    if (user && !initializationAttempted.current) {
      console.log(`Attempting to initialize ${type} chat, user:`, user.id, 
                 conversationId ? `with existing conversation: ${conversationId}` : 'with new conversation');
      
      const loadChat = async () => {
        initializationAttempted.current = true;
        try {
          // Pass the conversationId directly to initializeChat
          const chatSession = await initializeChat(conversationId);
          
          if (chatSession) {
            console.log(`Successfully loaded ${type} chat session with ${chatSession.messages?.length || 0} messages`);
            setSession(chatSession);
          } else {
            console.error(`Failed to initialize ${type} chat session`);
            toast({
              title: "Chat Error",
              description: `Could not start a new ${type} conversation. Please try again.`,
              variant: "destructive"
            });
          }
        } catch (err) {
          console.error(`Error loading ${type} chat:`, err);
          // We still consider initialization attempted even if it fails
          toast({
            title: "Chat Error",
            description: err instanceof Error ? err.message : "Unknown error occurred",
            variant: "destructive"
          });
        }
      };
      
      loadChat();
    }
  }, [initializeChat, user, type, conversationId, toast]);
  
  // Reset initialization flag when user or type changes or when explicitly requested
  const resetChat = () => {
    console.log(`Resetting ${type} chat`);
    initializationAttempted.current = false;
    setSession(null);
  };
  
  const handleSendMessage = async (message: string) => {
    if (!session) return;
    
    const updatedSession = await sendMessage(message, session);
    if (updatedSession) {
      setSession(updatedSession);
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!session) return null;
    
    return await generateSummary(session);
  };
  
  const saveJournalEntryFromChat = async () => {
    if (!session || session.messages.length < 2 || type !== 'journal') return null;
    
    // Generate summary to save as journal entry
    const summary = await handleGenerateSummary();
    return summary;
  };
  
  return {
    session,
    loading,
    error,
    sendMessage: handleSendMessage,
    generateSummary: handleGenerateSummary,
    saveJournalEntryFromChat,
    resetChat
  };
};
