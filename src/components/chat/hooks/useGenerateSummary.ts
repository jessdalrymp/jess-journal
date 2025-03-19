
import { useState } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatMessagesForSummary } from '../chatUtils';
import { generateDeepseekResponse } from '../../../utils/deepseekApi';
import { saveConversationSummary } from '@/services/conversation';

export const useGenerateSummary = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateSummary = async (session: ConversationSession) => {
    if (!session || !user) {
      console.error("No active session or user not authenticated");
      return null;
    }
    
    setLoading(true);
    
    try {
      console.log(`Generating summary for ${session.type} conversation...`);
      if (!session.messages || session.messages.length <= 2) {
        console.log("Not enough messages to summarize");
        setLoading(false);
        return null;
      }
      
      const aiMessages = formatMessagesForSummary(session.messages);
      
      console.log("Requesting AI summary with prompt to create concise summary only...");
      // Modify the request to specifically ask for a concise summary
      const systemPrompt = `Create a brief summary of this conversation in JSON format with a title and summary. 
      Focus on the main topics discussed and key insights. Keep it concise (max 100 words) and in this format:
      {"title": "Short descriptive title", "summary": "Brief overview of the conversation"}`;
      
      // Add the system prompt to guide the AI to generate proper summaries
      const messagesWithPrompt = [
        { role: 'system', content: systemPrompt },
        ...aiMessages
      ];
      
      const response = await generateDeepseekResponse(messagesWithPrompt);
      
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
        // Attempt to create a basic title and summary from the raw text
        const lines = summaryText.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
          title = lines[0].replace(/^#|Title:|topic:/i, '').trim();
          summary = lines.slice(1).join('\n').trim();
        }
      }
      
      console.log("Saving summary to journal...", { 
        userId: user.id, 
        title, 
        summary, 
        sessionId: session.id,
        type: session.type 
      });
      
      await saveConversationSummary(user.id, title, summary, session.id, session.type);
      
      console.log("Summary saved to journal");
      
      toast({
        title: "Conversation Summarized",
        description: `Your ${session.type === 'story' ? 'story' : 'side quest'} has been saved to your journal.`,
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSummary,
    loading
  };
};
