
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
      
      console.log("Requesting AI summary...");
      const response = await generateDeepseekResponse(aiMessages);
      
      if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
        console.error("Received invalid response from AI service:", response);
        throw new Error("Failed to generate summary: Invalid AI response");
      }
      
      let summaryText = response.choices[0].message.content || "No summary available";
      console.log("Received summary from AI:", summaryText);
      
      let title = `${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Summary`;
      let summary = summaryText;
      
      try {
        const jsonSummary = JSON.parse(summaryText);
        if (jsonSummary.title && jsonSummary.summary) {
          title = jsonSummary.title;
          summary = jsonSummary.summary;
          console.log("Parsed JSON summary:", { title, summary });
        }
      } catch (e) {
        // If not in JSON format, try to create a more structured summary
        console.log("Summary not in JSON format, formatting as JSON");
        const currentDate = new Date().toISOString();
        const jsonObj = {
          title: title,
          summary: summary,
          timestamp: currentDate
        };
        summary = JSON.stringify(jsonObj, null, 2);
        summary = `\`\`\`json\n${summary}\n\`\`\``;
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
        description: `Your ${session.type} has been saved to your journal.`,
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
