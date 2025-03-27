
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";
import { clearCurrentConversationFromStorage, getCurrentConversationFromStorage } from "@/lib/storageUtils";
import { useGenerateSummary } from "../hooks/useGenerateSummary";
import { supabase } from '@/integrations/supabase/client';

export function useSaveDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  refreshData: boolean = false,
  persistConversation: boolean = false
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchJournalEntries, user } = useUserData();
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');
  const [currentConversation, setCurrentConversation] = useState(null);

  // Get the current conversation from storage once when dialog opens
  useEffect(() => {
    if (open) {
      setSaveComplete(false);
      setIsSaving(false);
      const conversation = getCurrentConversationFromStorage('story');
      setCurrentConversation(conversation);
      
      // Generate a default title from the first few user messages if available
      if (conversation && conversation.messages && conversation.messages.length > 0) {
        const userMessages = conversation.messages
          .filter(msg => msg.role === 'user')
          .slice(0, 2);
          
        if (userMessages.length > 0) {
          const firstMessage = userMessages[0].content;
          // Create title from first user message (limited to 40 chars)
          const suggestedTitle = firstMessage.length > 40 
            ? firstMessage.substring(0, 40) + '...' 
            : firstMessage;
          setConversationTitle(suggestedTitle);
        } else {
          setConversationTitle(`My Story - ${new Date().toLocaleDateString()}`);
        }
      } else {
        setConversationTitle(`My Story - ${new Date().toLocaleDateString()}`);
      }
    }
  }, [open]);

  // Setup the generate summary hook with the current conversation ID
  const { generateTitleAndSummary, generating } = useGenerateSummary(
    currentConversation?.id || null,
    'story',
    () => {
      // Immediately fetch journal entries after saving to update the history view
      console.log("Summary saved, fetching journal entries to refresh history view");
      fetchJournalEntries(); 
      
      // If refreshData was requested, note that we've already done it
      if (refreshData) {
        console.log("Additional refresh was requested, but already done");
      }
      
      setSaveComplete(true);
      
      // Always redirect to dashboard after saving
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  );

  const saveConversationDirectly = async (conversationId, title) => {
    if (!user) return false;
    
    try {
      console.log(`Saving conversation ${conversationId} directly to journal with title: ${title}`);
      
      // Create a basic summary content
      const basicContent = `This conversation has been saved with the title: ${title}. The AI generated summary was not available.`;
      
      // Save directly to journal_entries
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          conversation_id: conversationId,
          prompt: title,
          content: basicContent,
          type: 'story'
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error saving conversation directly:', error);
        return false;
      }
      
      console.log('Successfully saved conversation directly with entry ID:', data.id);
      return true;
    } catch (error) {
      console.error('Error in saveConversationDirectly:', error);
      return false;
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked in SaveChatDialog");
    if (isSaving || saveComplete) {
      console.log("Already saving or save completed, ignoring duplicate click");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const currentConversation = getCurrentConversationFromStorage('story');
      console.log("Current conversation retrieved:", currentConversation?.id);
      
      if (currentConversation && currentConversation.messages.length > 1) {
        console.log("Saving conversation to journal with title:", conversationTitle);
        
        try {
          // Attempt to generate a summary
          await generateTitleAndSummary(
            currentConversation.messages, 
            conversationTitle
          );
        } catch (error) {
          // If summary generation fails, save directly without a summary
          console.error("Error generating summary, saving directly:", error);
          
          const saved = await saveConversationDirectly(
            currentConversation.id, 
            conversationTitle
          );
          
          if (saved) {
            // Refresh journal entries to show the new entry
            fetchJournalEntries();
            
            setSaveComplete(true);
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            throw new Error("Failed to save conversation directly");
          }
        }
      }
      
      if (!persistConversation) {
        clearCurrentConversationFromStorage('story');
      }
      
      const message = persistConversation 
        ? "Your story has been saved to your journal. You can continue your conversation."
        : "Your story chat has been saved to your journal. A new conversation will begin next time.";
      
      toast({
        title: "Conversation saved",
        description: message,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
      toast({
        title: "Error saving conversation",
        description: "There was a problem saving your story. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving || saveComplete) {
      console.log("Cannot cancel while saving or after save completed");
      return;
    }
    onOpenChange(false);
  };

  return {
    conversationTitle,
    setConversationTitle,
    isSaving,
    generating,
    saveComplete,
    handleSave,
    handleCancel
  };
}
