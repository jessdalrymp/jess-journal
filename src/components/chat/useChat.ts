
import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useInitializeChat } from './hooks/useInitializeChat';
import { useSendMessage } from './hooks/useSendMessage';
import { useGenerateSummary } from './hooks/useGenerateSummary';

export const useChat = (type: 'story' | 'sideQuest' | 'action' | 'journal', initialMessage?: string) => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const isInitializing = useRef(false);
  const hasInitialized = useRef(false);
  const initialMessageRef = useRef(initialMessage);
  
  const { user } = useAuth();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  
  const loading = initLoading || sendLoading || summaryLoading;
  const error = initError;
  
  useEffect(() => {
    // Store initialMessage in ref to avoid dependency issues
    initialMessageRef.current = initialMessage;
  }, [initialMessage]);
  
  useEffect(() => {
    // Only load chat if user exists and we haven't started initializing yet
    // and we haven't already successfully initialized
    if (user && !isInitializing.current && !session && !hasInitialized.current) {
      const loadChat = async () => {
        isInitializing.current = true;
        try {
          console.log(`Loading ${type} chat for user:`, user.id);
          const chatSession = await initializeChat();
          if (chatSession) {
            console.log(`Successfully loaded ${type} chat session`);
            
            // If we have an initial message and this is a new conversation (only has 1 message)
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
            
            hasInitialized.current = true;
          }
        } catch (err) {
          console.error(`Error loading ${type} chat:`, err);
        } finally {
          isInitializing.current = false;
        }
      };
      
      loadChat();
    }
  }, [initializeChat, user, type, session]);
  
  // Reset hasInitialized when user or type changes
  useEffect(() => {
    hasInitialized.current = false;
  }, [user, type]);
  
  const handleSendMessage = async (message: string) => {
    if (!session) return;
    
    const updatedSession = await sendMessage(message, session);
    if (updatedSession) {
      setSession(updatedSession);
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!session) return;
    
    return await generateSummary(session);
  };
  
  return {
    session,
    loading,
    error,
    sendMessage: handleSendMessage,
    generateSummary: handleGenerateSummary
  };
};
