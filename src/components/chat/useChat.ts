
import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { generateDeepseekResponse } from '../../utils/deepseekApi';
import { formatMessagesForAI, getInitialMessage } from './chatUtils';

export const useChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { startConversation, addMessageToConversation } = useUserData();
  const { toast } = useToast();
  
  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Initializing chat for type:", type);
      
      // Get conversation from Supabase (via UserDataContext)
      const conversation = await startConversation(type);
      setSession(conversation);
      
      // For first-time users, the welcome message is shown in a modal
      // Only add the AI's first message to the chat if NOT on story page or if not first visit
      if (!conversation.messages || conversation.messages.length === 0) {
        const isStoryType = type === 'story';
        const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
        const isFirstVisit = isStoryType && !hasVisitedStoryPage;
        
        if (!isFirstVisit) {
          const initialMessage = getInitialMessage(type);
          await addMessageToConversation(
            conversation.id,
            initialMessage,
            'assistant'
          );
          
          setSession(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              messages: [
                ...(prev.messages || []),
                {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: initialMessage,
                  timestamp: new Date(),
                },
              ],
            };
          });
        } else {
          // On first visit to story page, add a simplified intro message
          const briefIntro = "I'm excited to hear your story! What would you like to talk about today?";
          await addMessageToConversation(
            conversation.id,
            briefIntro,
            'assistant'
          );
          
          setSession(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              messages: [
                ...(prev.messages || []),
                {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: briefIntro,
                  timestamp: new Date(),
                },
              ],
            };
          });
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [type, addMessageToConversation, startConversation, toast]);
  
  const sendMessage = async (message: string) => {
    if (!session) {
      console.error("No active session");
      return;
    }
    
    setLoading(true);
    
    try {
      // Update local state first for immediate UI feedback
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), newUserMessage],
        };
      });
      
      // Then save to Supabase
      await addMessageToConversation(session.id, message, 'user');
      
      // Get updated messages including the new user message
      const updatedMessages = [...(session.messages || []), newUserMessage];
      
      // Format messages for DeepSeek API
      const aiMessages = formatMessagesForAI(updatedMessages, type);
      
      // Get AI response
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      // Create AI message object
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      // Update UI
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), newAIMessage],
        };
      });
      
      // Save AI message to Supabase
      await addMessageToConversation(session.id, aiResponseText, 'assistant');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);
  
  return {
    session,
    loading,
    sendMessage
  };
};
