import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useInitializeChat } from './hooks/useInitializeChat';
import { useSendMessage } from './hooks/useSendMessage';
import { useGenerateSummary } from './hooks/useGenerateSummary';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';
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
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  
  const loading = initLoading || sendLoading || summaryLoading;
  
  useEffect(() => {
    if (initError) {
      setError(initError);
      toast({
        title: "Initialization Error",
        description: initError,
        variant: "destructive"
      });
    }
  }, [initError, toast]);
  
  useEffect(() => {
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);
  
  useEffect(() => {
    if (user && !initializationAttempted.current) {
      console.log(`Attempting to initialize ${type} chat, user:`, user.id, 
                 conversationId ? `with existing conversation: ${conversationId}` : 'with new conversation');
      
      const loadChat = async () => {
        initializationAttempted.current = true;
        try {
          setError(null);
          
          const storedConversation = getCurrentConversationFromStorage(type);
          
          if (storedConversation && storedConversation.messages.length > 0) {
            console.log(`Using existing ${type} chat from storage with ${storedConversation.messages.length} messages`);
            setSession(storedConversation);
            return;
          }
          
          const chatSession = await initializeChat(conversationId);
          if (chatSession) {
            console.log(`Successfully loaded ${type} chat session with ${chatSession.messages?.length || 0} messages`);
            
            if (initialMessageRef.current && 
                initialMessageRef.current !== "" && 
                (!chatSession.messages.length || 
                 (chatSession.messages.length === 1 && chatSession.messages[0].role === 'assistant'))) {
              console.log(`Setting custom initial message for ${type} chat`);
              const updatedSession = {
                ...chatSession,
                messages: chatSession.messages.length ? [
                  {
                    ...chatSession.messages[0],
                    content: initialMessageRef.current
                  }
                ] : [
                  {
                    id: Date.now().toString(),
                    role: 'assistant' as const,
                    content: initialMessageRef.current,
                    timestamp: new Date()
                  }
                ]
              };
              setSession(updatedSession);
            } else {
              setSession(chatSession);
            }
          } else {
            setError("Failed to initialize chat. Please try again.");
            toast({
              title: "Initialization Error",
              description: "Failed to load chat session. Please try refreshing the page.",
              variant: "destructive"
            });
          }
        } catch (err) {
          console.error(`Error loading ${type} chat:`, err);
          setError(`Error loading ${type} chat: ${err instanceof Error ? err.message : 'Unknown error'}`);
          toast({
            title: "Error Loading Chat",
            description: "There was a problem loading your chat. Please try again.",
            variant: "destructive"
          });
        }
      };
      
      loadChat();
    }
  }, [initializeChat, user, type, conversationId, toast]);
  
  useEffect(() => {
    if (!conversationId) {
      initializationAttempted.current = false;
    }
  }, [user, type, conversationId]);
  
  const handleSendMessage = async (message: string) => {
    if (!session) return;
    
    try {
      const updatedSession = await sendMessage(message, session);
      if (updatedSession) {
        setSession(updatedSession);
      } else {
        setError("Failed to send message. Please try again.");
        toast({
          title: "Message Error",
          description: "Your message could not be sent. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Error sending message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast({
        title: "Message Error",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!session) return null;
    
    try {
      return await generateSummary(session);
    } catch (err) {
      console.error("Error generating summary:", err);
      toast({
        title: "Summary Error",
        description: "Could not generate conversation summary.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const saveJournalEntryFromChat = async () => {
    if (!session || session.messages.length < 2 || type !== 'journal') return null;
    
    try {
      const summary = await handleGenerateSummary();
      return summary;
    } catch (err) {
      console.error("Error saving journal entry:", err);
      toast({
        title: "Error Saving Journal Entry",
        description: "Could not save journal entry from chat.",
        variant: "destructive"
      });
      return null;
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
