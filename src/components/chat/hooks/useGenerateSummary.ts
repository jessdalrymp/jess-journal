
import { useState } from 'react';
import { ConversationSession } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatMessagesForSummary } from '../chatUtils';
import { generateDeepseekResponse } from '../../../utils/deepseekApi';
import { saveConversationSummary } from '@/services/conversation';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Format messages for the AI to summarize
      const aiMessages = formatMessagesForSummary(session.messages);
      
      console.log("Requesting AI summary...");
      const response = await generateDeepseekResponse(aiMessages);
      
      if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
        console.error("Received invalid response from AI service:", response);
        throw new Error("Failed to generate summary: Invalid AI response");
      }
      
      let summaryText = response.choices[0].message.content || "No summary available";
      console.log("Received summary from AI:", summaryText);
      
      // Parse the AI response for title and summary
      let title = "Conversation Summary";
      let summary = summaryText;
      
      try {
        // Check if the response is in JSON format
        if (summaryText.includes('{') && summaryText.includes('}')) {
          const jsonMatch = summaryText.match(/{[\s\S]*?}/);
          if (jsonMatch) {
            const jsonString = jsonMatch[0];
            const jsonSummary = JSON.parse(jsonString);
            if (jsonSummary.title) title = jsonSummary.title;
            if (jsonSummary.summary) summary = jsonSummary.summary;
            console.log("Parsed JSON summary:", { title, summary });
          }
        }
      } catch (e) {
        console.log("Summary not in JSON format or parsing failed, using raw text");
      }
      
      console.log("Saving summary to database and journal...", { 
        userId: user.id, 
        title, 
        summary, 
        sessionId: session.id,
        type: session.type 
      });
      
      // First, update the conversation record in the conversations table directly
      const { error: conversationError } = await supabase
        .from('conversations')
        .update({
          title: title,
          summary: summary,
          updated_at: new Date()
        })
        .eq('id', session.id);
      
      if (conversationError) {
        console.error("Error updating conversation summary:", conversationError);
        throw new Error("Failed to update conversation summary");
      }
      
      // Then, save the summary to journal_entries table
      const { error: journalError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          prompt: title,
          content: `\`\`\`json\n${JSON.stringify({ title, summary, type: session.type }, null, 2)}\n\`\`\``,
          conversation_id: session.id,
          type: session.type
        });
      
      if (journalError) {
        console.error("Error saving journal entry:", journalError);
        throw new Error("Failed to save journal entry");
      }
      
      console.log("Summary saved successfully to both conversations and journal_entries tables");
      
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
