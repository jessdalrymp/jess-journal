
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
  
  // Use the user from Auth context as the source of truth
  const user = authUser;
  
  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Initializing chat for type:", type);
      console.log("User authentication state:", user ? "Authenticated" : "Not authenticated");
      
      // Check if user is authenticated first
      if (!user) {
        console.log("User not authenticated, cannot initialize chat");
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      // Try to get conversation from localStorage first
      const cachedConversation = getCurrentConversationFromStorage(type);
      if (cachedConversation && cachedConversation.userId === user.id) {
        console.log(`Loaded ${type} conversation from localStorage`);
        setSession(cachedConversation);
        setLoading(false);
        return;
      }
      
      // Get conversation from Supabase or create a new one
      try {
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
            // Save to localStorage
            saveCurrentConversationToStorage(updatedSession);
          } else {
            // On first visit to story page, add a simplified intro message
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
            // Save to localStorage
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
      // Update local state first for immediate UI feedback
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
      // Update localStorage with user message
      saveCurrentConversationToStorage(updatedSessionWithUserMsg);
      
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
        role: 'assistant' as const,
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      // Update UI
      const finalUpdatedSession: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage, newAIMessage],
      };
      
      setSession(finalUpdatedSession);
      // Update localStorage with AI response
      saveCurrentConversationToStorage(finalUpdatedSession);
      
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
  
  const generateSummary = async () => {
    if (!session || !user) {
      console.error("No active session or user not authenticated");
      return;
    }
    
    try {
      console.log("Generating summary for conversation...");
      // Only proceed if there are at least a few messages to summarize
      if (session.messages.length <= 2) {
        console.log("Not enough messages to summarize");
        return;
      }
      
      // Format messages for the AI summary
      const aiMessages = formatMessagesForSummary(session.messages);
      
      // Get AI summary
      const response = await generateDeepseekResponse(aiMessages);
      let summaryText = response.choices[0].message.content;
      
      // Try to parse as JSON if it's in that format
      let title = "Conversation Summary";
      let summary = summaryText;
      
      try {
        const jsonSummary = JSON.parse(summaryText);
        if (jsonSummary.title && jsonSummary.summary) {
          title = jsonSummary.title;
          summary = jsonSummary.summary;
        }
      } catch (e) {
        // If not valid JSON, use the whole text as summary
        console.log("Summary not in JSON format, using raw text");
      }
      
      // Save the summary to the user's journal
      await saveConversationSummary(user.id, title, summary, session.id);
      
      console.log("Summary saved to journal");
      
      // Show success toast
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
      });
    }
  };
  
  useEffect(() => {
    if (user) {
      initializeChat();
    } else {
      // Clear any error if we're not authenticated yet
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
