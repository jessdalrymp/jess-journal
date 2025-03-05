import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { generateDeepseekResponse } from '../../utils/deepseekApi';
import { formatMessagesForAI, getInitialMessage, formatMessagesForSummary } from './chatUtils';
import { 
  saveCurrentConversationToStorage, 
  getCurrentConversationFromStorage
} from '@/lib/storageUtils';
import { saveConversationSummary } from '@/services/conversationService';

export const useChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user: contextUser, startConversation, addMessageToConversation } = useUserData();
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  
  const user = authUser;
  
  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Initializing chat for type:", type);
      console.log("User authentication state:", user ? "Authenticated" : "Not authenticated");
      
      if (!user) {
        console.log("User not authenticated, cannot initialize chat");
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      const cachedConversation = getCurrentConversationFromStorage(type);
      if (cachedConversation && cachedConversation.userId === user.id) {
        console.log(`Loaded ${type} conversation from localStorage`);
        setSession(cachedConversation);
        setLoading(false);
        return;
      }
      
      try {
        const conversation = await startConversation(type);
        setSession(conversation);
        
        if (!conversation.messages || conversation.messages.length === 0) {
          const isStoryType = type === 'story';
          const hasVisitedStoryPage = localStorage.getItem('hasVisitedStoryPage');
          const isFirstVisit = isStoryType && !hasVisitedStoryPage;
          
          if (!isFirstVisit) {
            const initialMessage = getInitialMessage(type);
            await addMessageToConversation(
              conversation.id,
              initialMessage,
              'assistant' as const
            );
            
            const updatedSession: ConversationSession = {
              ...conversation,
              messages: [
                {
                  id: Date.now().toString(),
                  role: 'assistant' as const,
                  content: initialMessage,
                  timestamp: new Date(),
                },
              ],
            };
            
            setSession(updatedSession);
            saveCurrentConversationToStorage(updatedSession);
          } else {
            const briefIntro = "I'm excited to hear your story! What would you like to talk about today?";
            await addMessageToConversation(
              conversation.id,
              briefIntro,
              'assistant' as const
            );
            
            const updatedSession: ConversationSession = {
              ...conversation,
              messages: [
                {
                  id: Date.now().toString(),
                  role: 'assistant' as const,
                  content: briefIntro,
                  timestamp: new Date(),
                },
              ],
            };
            
            setSession(updatedSession);
            saveCurrentConversationToStorage(updatedSession);
          }
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to initialize chat");
        }
        toast({
          title: "Error starting conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
      setError("Failed to initialize chat");
      toast({
        title: "Error starting conversation",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [type, user, addMessageToConversation, startConversation, toast]);
  
  const sendMessage = async (message: string) => {
    if (!session) {
      console.error("No active session");
      return;
    }
    
    setLoading(true);
    
    try {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      };
      
      const updatedSessionWithUserMsg: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage],
      };
      
      setSession(updatedSessionWithUserMsg);
      saveCurrentConversationToStorage(updatedSessionWithUserMsg);
      
      await addMessageToConversation(session.id, message, 'user');
      
      const updatedMessages = [...(session.messages || []), newUserMessage];
      
      const aiMessages = formatMessagesForAI(updatedMessages, type);
      
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      const finalUpdatedSession: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage, newAIMessage],
      };
      
      setSession(finalUpdatedSession);
      saveCurrentConversationToStorage(finalUpdatedSession);
      
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
  
  const generateSummary = async () => {
    if (!session || !user) {
      console.error("No active session or user not authenticated");
      return;
    }
    
    try {
      console.log("Generating summary for conversation...");
      if (!session.messages || session.messages.length <= 2) {
        console.log("Not enough messages to summarize");
        return;
      }
      
      const aiMessages = formatMessagesForSummary(session.messages);
      
      console.log("Requesting AI summary...");
      const response = await generateDeepseekResponse(aiMessages);
      
      if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
        console.error("Received invalid response from AI service:", response);
        throw new Error("Failed to generate summary: Invalid AI response");
      }
      
      let summaryText = response.choices[0].message.content || "No summary available";
      console.log("Received summary from AI:", summaryText);
      
      let title = "Conversation Summary";
      let summary = summaryText;
      
      try {
        const jsonSummary = JSON.parse(summaryText);
        if (jsonSummary.title && jsonSummary.summary) {
          title = jsonSummary.title;
          summary = jsonSummary.summary;
          console.log("Parsed JSON summary:", { title, summary });
        }
      } catch (e) {
        console.log("Summary not in JSON format, using raw text");
      }
      
      console.log("Saving summary to journal...", { userId: user.id, title, summary, sessionId: session.id });
      
      const { saveConversationSummary } = await import('../../services/conversation');
      await saveConversationSummary(user.id, title, summary, session.id);
      
      console.log("Summary saved to journal");
      
      toast({
        title: "Conversation Summarized",
        description: "Your story has been saved to your journal.",
        duration: 3000,
      });
      
      return { title, summary };
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error Saving Summary",
        description: "We couldn't save your conversation summary.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  useEffect(() => {
    if (user) {
      initializeChat();
    } else {
      setError(null);
    }
  }, [initializeChat, user]);
  
  return {
    session,
    loading,
    error,
    sendMessage,
    generateSummary
  };
};
