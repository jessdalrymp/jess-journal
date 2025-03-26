
import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook for managing journal chat state and interactions
 */
export const useJournalChatState = (setRetryCount: (updater: (prev: number) => number) => void) => {
  const [showJournalChat, setShowJournalChat] = useState(false);
  const [skipPrompt, setSkipPrompt] = useState(false);
  const location = useLocation();

  // Handle navigation state for journal chat
  useEffect(() => {
    if (location.state?.showJournalChat) {
      console.log("JournalHistory - Showing journal chat from navigation state");
      setShowJournalChat(true);
      if (location.state?.skipPrompt) {
        setSkipPrompt(true);
      }
    }
  }, [location.state]);

  const handleNewEntry = useCallback(() => {
    console.log("JournalHistory - New entry");
    setShowJournalChat(true);
    setSkipPrompt(false);
  }, []);

  const handleJournalChatBack = useCallback(() => {
    console.log("JournalHistory - Back from chat");
    setShowJournalChat(false);
  }, []);

  const handleJournalChatSave = useCallback(() => {
    console.log("JournalHistory - Chat saved, scheduling refresh");
    setShowJournalChat(false);
    
    // Do an immediate refresh by incrementing retry count
    setRetryCount(prev => prev + 1);
  }, [setRetryCount]);

  return {
    showJournalChat,
    skipPrompt,
    handleNewEntry,
    handleJournalChatBack,
    handleJournalChatSave
  };
};
