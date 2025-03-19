
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
  const [error, setError] = useState<string | null>(null);
  const initializationAttempted = useRef(false);
  const initialMessageRef = useRef(initialMessage);
  const retryCount = useRef(0);
  const maxRetries = 3;
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  
  const loading = initLoading || sendLoading || summaryLoading;
  
  // Set error state based on initialization error
  useEffect(() => {
    if (initError) {
      setError(initError);
    }
  }, [initError]);
  
  useEffect(() => {
    // Store initialMessage in ref to avoid dependency issues
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);
  
  // Function to initialize chat with retry logic
  const attemptInitialization = async () => {
    if (!user) return;
    
    try {
      console.log(`Attempting to initialize ${type} chat (attempt ${retryCount.current + 1}), user:`, user.id, 
                 conversationId ? `with existing conversation: ${conversationId}` : 'with new conversation');
      
      const chatSession = await initializeChat(conversationId);
      
      if (chatSession) {
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
        
        // Reset error state on successful initialization
        setError(null);
        retryCount.current = 0;
      } else {
        throw new Error("Chat initialization returned null session");
      }
    } catch (err) {
      console.error(`Error loading ${type} chat:`, err);
      setError(`Failed to initialize chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Retry logic for initialization
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(attemptInitialization, 1000 * retryCount.current); // Exponential backoff
      } else {
        toast({
          title: "Connection issue",
          description: "Unable to connect to the chat service. Please refresh and try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  useEffect(() => {
    // Only load chat if user exists and we haven't attempted initialization yet
    if (user && !initializationAttempted.current) {
      initializationAttempted.current = true;
      attemptInitialization();
    }
  }, [initializeChat, user, type, conversationId]);
  
  // Reset initialization flag when user or type changes
  useEffect(() => {
    if (conversationId) {
      // Don't reset if we're loading a specific conversation
      return;
    }
    initializationAttempted.current = false;
    setError(null);
    retryCount.current = 0;
  }, [user, type, conversationId]);
  
  const handleSendMessage = async (message: string) => {
    if (!session) {
      setError("Cannot send message: No active session");
      return;
    }
    
    try {
      const updatedSession = await sendMessage(message, session);
      if (updatedSession) {
        setSession(updatedSession);
        setError(null); // Clear any previous errors on successful message send
      } else {
        throw new Error("Message sending returned null session");
      }
    } catch (err) {
      console.error(`Error sending message in ${type} chat:`, err);
      setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast({
        title: "Message failed to send",
        description: "Please try again. If the problem persists, refresh the page.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!session) {
      console.error("Cannot generate summary: No active session");
      return null;
    }
    
    try {
      console.log("Generating summary for session:", session.id);
      const result = await generateSummary(session);
      console.log("Summary generation result:", result);
      return result;
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(`Failed to generate summary: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  };
  
  const saveJournalEntryFromChat = async () => {
    if (!session || session.messages.length < 2 || type !== 'journal') {
      console.log("Cannot save journal entry - invalid session state");
      return null;
    }
    
    console.log("Saving journal entry from chat...");
    
    // Generate summary to save as journal entry
    const summary = await handleGenerateSummary();
    console.log("Journal summary generated:", summary);
    return summary;
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
