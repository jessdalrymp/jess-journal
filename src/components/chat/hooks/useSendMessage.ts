
import { useState } from 'react';
import { ConversationSession, ChatMessage } from '@/lib/types';
import { useUserData } from '../../../context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { formatMessagesForAI } from '../chatUtils';
import { generateDeepseekResponse } from '../../../utils/deepseekApi';
import { saveCurrentConversationToStorage } from '@/lib/storageUtils';
import { saveJournalEntryFromConversation } from '@/services/conversation/journalIntegration';

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
      
      saveCurrentConversationToStorage(updatedSessionWithUserMsg);
      
      await addMessageToConversation(session.id, message, 'user');
      
      const updatedMessages = [...(session.messages || []), newUserMessage];
      
      let aiMessages = formatMessagesForAI(updatedMessages, type);
      
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
      
      // For journal entries, save important insights to the journal
      if (type === 'journal' && session.messages.length > 4) {
        try {
          const summaryMessages = [
            {
              role: 'system' as const,
              content: `Review the conversation about the journaling prompt and create a concise summary of key insights and reflections. Format as JSON with "title" and "summary" fields.`
            },
            ...finalUpdatedSession.messages.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            }))
          ];
          
          const summaryResponse = await generateDeepseekResponse(summaryMessages);
          const summaryText = summaryResponse.choices[0].message.content;
          
          try {
            // Try to parse JSON from the response
            let summaryContent = summaryText;
            let title = finalUpdatedSession.messages[0].content.substring(0, 50) + '...';
            
            // Try to extract JSON if it exists
            try {
              const jsonMatch = summaryText.match(/```json\s*([\s\S]*?)```/) || 
                               summaryText.match(/\{[\s\S]*?\}/);
              
              if (jsonMatch) {
                const parsedJson = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
                if (parsedJson.title) title = parsedJson.title;
                summaryContent = JSON.stringify(parsedJson, null, 2);
              }
            } catch (e) {
              console.log('Could not parse JSON from summary, using raw text');
            }
            
            const journalContent = JSON.stringify({
              title: title,
              summary: summaryContent,
              type: 'journal'
            }, null, 2);
            
            await saveJournalEntryFromConversation(
              session.userId, 
              finalUpdatedSession.messages[0].content, 
              `\`\`\`json\n${journalContent}\n\`\`\``, 
              'journal'
            );
          } catch (e) {
            console.error('Error saving journal entry from conversation:', e);
          }
        } catch (e) {
          console.error('Error generating journal summary:', e);
        }
      }
      
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
