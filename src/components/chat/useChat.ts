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
  const [internalError, setInternalError] = useState<string | null>(null);
  const [attemptedLoginCheck, setAttemptedLoginCheck] = useState(false);
  const initializationAttempted = useRef(false);
  const initialMessageRef = useRef(initialMessage);
  
  const { user, loading: authLoading } = useAuth();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateTitleAndSummary, generating: summaryLoading } = useGenerateSummary(
    session?.id || null,
    type
  );
  const { toast } = useToast();
  
  const loading = initLoading || sendLoading || summaryLoading;
  const error = initError || internalError;
  
  useEffect(() => {
    // Store initialMessage in ref to avoid dependency issues
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);
  
  // Check authentication status and log results
  useEffect(() => {
    if (!attemptedLoginCheck && !authLoading) {
      setAttemptedLoginCheck(true);
      if (user) {
        console.log(`useChat: User is authenticated, user ID: ${user.id}`);
      } else {
        console.log('useChat: User is NOT authenticated');
        setInternalError('User not authenticated');
      }
    }
  }, [user, authLoading, attemptedLoginCheck]);
  
  // Initialize chat when auth state is confirmed
  useEffect(() => {
    // Only load chat if user exists and we haven't attempted initialization yet
    if (user && !initializationAttempted.current && !authLoading) {
      console.log(`Attempting to initialize ${type} chat, user:`, user.id, 
                 conversationId ? `with existing conversation: ${conversationId}` : 'with new conversation');
      
      const loadChat = async () => {
        initializationAttempted.current = true;
        setInternalError(null);
        
        try {
          // Pass the conversationId directly to initializeChat
          const chatSession = await initializeChat(conversationId);
          
          if (!chatSession) {
            const errorMsg = `Failed to initialize ${type} chat: No session returned`;
            console.error(errorMsg);
            setInternalError(errorMsg);
            toast({
              title: "Error starting conversation",
              description: "Please try again later",
              variant: "destructive"
            });
            return;
          }
          
          console.log(`Successfully loaded ${type} chat session with ${chatSession.messages?.length || 0} messages`);
          
          // If we have a custom initial message and this is a new conversation (only has 1 message)
          if (initialMessageRef.current && chatSession.messages.length === 1) {
            console.log(`Setting custom initial message for ${type} chat`);
            // Replace the default initial message with our custom one
            const updatedSession = {
              ...chatSession,
              messages: [
                {
                  ...chatSession.messages[0],
                  content: initialMessageRef.current
                }
              ]
            };
            setSession(updatedSession);
          } else {
            setSession(chatSession);
          }
        } catch (err) {
          const errorMsg = `Error loading ${type} chat: ${err instanceof Error ? err.message : 'Unknown error'}`;
          console.error(errorMsg, err);
          setInternalError(errorMsg);
          toast({
            title: "Error starting conversation",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      };
      
      loadChat();
    }
  }, [initializeChat, user, type, conversationId, toast, authLoading]);
  
  // Reset initialization flag when user or type changes
  useEffect(() => {
    if (conversationId) {
      // Don't reset if we're loading a specific conversation
      return;
    }
    
    if (!authLoading) {
      // Only reset when auth loading is complete
      initializationAttempted.current = false;
      setAttemptedLoginCheck(false); // Reset login check as well
    }
  }, [user, type, conversationId, authLoading]);
  
  const handleSendMessage = async (message: string) => {
    if (!session) {
      const errorMsg = "Cannot send message: No active session";
      console.error(errorMsg);
      setInternalError(errorMsg);
      return;
    }
    
    try {
      const updatedSession = await sendMessage(message, session);
      if (updatedSession) {
        setSession(updatedSession);
      } else {
        throw new Error("Failed to send message: No updated session returned");
      }
    } catch (err) {
      const errorMsg = `Error sending message: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error(errorMsg, err);
      setInternalError(errorMsg);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!session) {
      console.error("Cannot generate summary: No active session");
      return;
    }
    
    try {
      await generateTitleAndSummary(session.messages);
    } catch (err) {
      console.error(`Error generating summary: ${err instanceof Error ? err.message : 'Unknown error'}`, err);
      toast({
        title: "Error generating summary",
        description: "Your conversation was saved but we couldn't generate a summary",
        variant: "destructive"
      });
    }
  };
  
  const saveJournalEntryFromChat = async () => {
    if (!session || session.messages.length < 2 || type !== 'journal') return;
    
    try {
      // Simply save the journal entry without generating a summary
      await handleGenerateSummary();
    } catch (err) {
      console.error(`Error saving journal entry: ${err instanceof Error ? err.message : 'Unknown error'}`, err);
      toast({
        title: "Error saving journal entry",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  return {
    session,
    loading,
    error,
    sendMessage: handleSendMessage,
    generateSummary: handleGenerateSummary,
    saveJournalEntryFromChat
  };
};
