
import { useState } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useUserData } from '../../../context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { formatMessagesForAI } from '../chatUtils';
import { generateDeepseekResponse } from '../../../utils/deepseekApi';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';

export const useSendMessage = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
  const [loading, setLoading] = useState(false);
  const { addMessageToConversation } = useUserData();
  const { toast } = useToast();

  const sendMessage = async (message: string, session: ConversationSession) => {
    if (!session) {
      console.error("No active session");
      return null;
    }
    
    setLoading(true);
    
    try {
      // Check if message is a JSON string containing brevity preference
      let actualMessage = message;
      let brevityPreference = 'detailed';
      
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage && parsedMessage.message && parsedMessage.brevity) {
          actualMessage = parsedMessage.message;
          brevityPreference = parsedMessage.brevity;
          console.log(`Using ${brevityPreference} response style`);
        }
      } catch (e) {
        // Not a JSON message, use the original message
        actualMessage = message;
      }
      
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: actualMessage, // Show the actual message to the user, not the JSON
        timestamp: new Date(),
      };
      
      const updatedSessionWithUserMsg: ConversationSession = {
        ...session,
        messages: [...(session.messages || []), newUserMessage],
      };
      
      saveCurrentConversationToStorage(updatedSessionWithUserMsg);
      
      await addMessageToConversation(session.id, actualMessage, 'user');
      
      const updatedMessages = [...(session.messages || []), newUserMessage];
      
      let aiMessages = formatMessagesForAI(updatedMessages, type);
      
      // Add brevity instruction to the system prompt
      if (brevityPreference === 'short') {
        const brevityInstruction = "\n\nIMPORTANT: Keep your responses brief, concise, and to the point. Aim for 1-3 short paragraphs maximum.";
        aiMessages[0].content = aiMessages[0].content + brevityInstruction;
      }
      
      // For journal type, include more structured context from the current journal prompt
      if (type === 'journal' && localStorage.getItem('currentJournalPrompt')) {
        try {
          const promptData = JSON.parse(localStorage.getItem('currentJournalPrompt') || '{}');
          const contextMessage = `The user is working on a journaling prompt titled "${promptData.title}" with the prompt: "${promptData.prompt}". 
          The specific steps for this journaling exercise are:
          ${promptData.instructions.map((instruction, i) => `${i+1}. ${instruction}`).join('\n')}
          
          The user's message is related to this prompt. Help them work through one step at a time, focusing on depth rather than breadth. 
          Be concise but targeted in your questions and responses. Don't repeat the full prompt or all steps unless relevant.`;
          
          aiMessages[0].content = aiMessages[0].content + "\n\n" + contextMessage;
        } catch (e) {
          console.error('Error adding journal context to AI messages:', e);
        }
      }
      
      console.log(`Sending ${type} messages to AI with system prompt:`, 
        aiMessages.length > 0 ? aiMessages[0].content.substring(0, 100) + '...' : 'No system prompt');
      console.log(`Using ${brevityPreference} response style`);
      
      const response = await generateDeepseekResponse(aiMessages);
      const aiResponseText = response.choices[0].message.content;
      
      console.log(`Received AI response for ${type}:`, 
        aiResponseText.substring(0, 100) + (aiResponseText.length > 100 ? '...' : ''));
      
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
      
      saveCurrentConversationToStorage(finalUpdatedSession);
      
      await addMessageToConversation(session.id, aiResponseText, 'assistant');
      
      return finalUpdatedSession;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading
  };
};
