
import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useInitializeChat } from './hooks/useInitializeChat';
import { useSendMessage } from './hooks/useSendMessage';
import { useGenerateSummary } from './hooks/useGenerateSummary';

export const useChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const isInitializing = useRef(false);
  
  const { user } = useAuth();
  const { initializeChat, loading: initLoading, error: initError } = useInitializeChat(type);
  const { sendMessage, loading: sendLoading } = useSendMessage(type);
  const { generateSummary, loading: summaryLoading } = useGenerateSummary();
  
  const loading = initLoading || sendLoading || summaryLoading;
  const error = initError;
  
  useEffect(() => {
    // Only load chat if user exists and we haven't started initializing yet
    if (user && !isInitializing.current && !session) {
      const loadChat = async () => {
        isInitializing.current = true;
        try {
          console.log(`Loading ${type} chat for user:`, user.id);
          const chatSession = await initializeChat();
          if (chatSession) {
            console.log(`Successfully loaded ${type} chat session`);
            setSession(chatSession);
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
