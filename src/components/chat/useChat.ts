
import { useState, useEffect } from 'react';
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
  
  const initializeChat = async () => {
    try {
      const newSession = await startConversation(type);
      setSession(newSession);
      
      const initialMessage = getInitialMessage(type);
      await addMessageToConversation(
        newSession.id,
        initialMessage,
        'assistant'
      );
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: initialMessage,
              timestamp: new Date(),
            },
          ],
        };
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const sendMessage = async (message: string) => {
    if (!session) return;
    
    setLoading(true);
    
    try {
      await addMessageToConversation(session.id, message, 'user');
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'user',
              content: message,
              timestamp: new Date(),
            },
          ],
        };
      });
      
      // Get updated messages including the new user message
      const updatedMessages = session.messages.concat({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
      
      // Format messages for DeepSeek API
      const aiMessages = formatMessagesForAI(updatedMessages, type);
      
      // Get AI response
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      await addMessageToConversation(session.id, aiResponseText, 'assistant');
      
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              role: 'user',
              content: message,
              timestamp: new Date(),
            },
            {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: aiResponseText,
              timestamp: new Date(),
            },
          ],
        };
      });
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
    initializeChat().catch((err) => console.error(err));
  }, []);
  
  return {
    session,
    loading,
    sendMessage
  };
};
