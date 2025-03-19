
import { useState, useEffect, useRef } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useInitializeChat } from './hooks/useInitializeChat';
import { useSendMessage } from './hooks/useSendMessage';
import { useGenerateSummary } from './hooks/useGenerateSummary';
import { getCurrentConversationFromStorage } from '@/lib/storageUtils';

export const useChat = (
  type: 'story' | 'sideQuest' | 'action' | 'journal', 
  initialMessage?: string,
  conversationId?: string | null
) => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const initializationAttempted = useRef(false);
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
    // Only load chat if user exists and we haven't attempted initialization yet
    if (user && !initializationAttempted.current) {
      console.log(`Attempting to initialize ${type} chat, user:`, user.id, 
                 conversationId ? `with existing conversation: ${conversationId}` : 'with new conversation');
      
      const loadChat = async () => {
        initializationAttempted.current = true;
        try {
          // First, check if there's an existing conversation in storage
          const existingConversation = getCurrentConversationFromStorage(type);
          
          if (existingConversation && existingConversation.messages.length > 0) {
            console.log(`Using existing ${type} chat from storage with ${existingConversation.messages.length} messages`);
            setSession(existingConversation);
            return;
          }
          
          // Otherwise, attempt to initialize from database or create new
          const chatSession = await initializeChat(conversationId);
          if (chatSession) {
            console.log(`Successfully loaded ${type} chat session with ${chatSession.messages?.length || 0} messages`);
            
            // If we have a custom initial message and this is a new conversation (empty or only has system message)
            // AND the initial message is not empty (for continuing conversations)
            if (initialMessageRef.current && 
                initialMessageRef.current !== "" && 
                (!chatSession.messages.length || 
                 (chatSession.messages.length === 1 && chatSession.messages[0].role === 'assistant'))) {
              console.log(`Setting custom initial message for ${type} chat`);
              // Replace the default initial message with our custom one
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
          }
        } catch (err) {
          console.error(`Error loading ${type} chat:`, err);
          // We still consider initialization attempted even if it fails
        }
      };
      
      loadChat();
    }
  }, [initializeChat, user, type, conversationId]);
  
  // Reset initialization flag when user or type changes but NOT conversationId
  useEffect(() => {
    if (conversationId) {
      // Don't reset if we're loading a specific conversation
      return;
    }
    initializationAttempted.current = false;
  }, [user, type, conversationId]);
  
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
    saveJournalEntryFromChat
  };
};
