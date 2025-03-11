
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";
import { useEffect, useState } from "react";
import { JournalPrompt, DEFAULT_PROMPT } from "./JournalChallengeContent";

export const JournalChatContent = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt | null>(null);
  
  useEffect(() => {
    // Try to get current prompt from localStorage
    const savedPrompt = localStorage.getItem('currentJournalPrompt');
    if (savedPrompt) {
      try {
        setCurrentPrompt(JSON.parse(savedPrompt));
      } catch (e) {
        console.error("Failed to parse stored journal prompt:", e);
        setCurrentPrompt(DEFAULT_PROMPT);
      }
    } else {
      setCurrentPrompt(DEFAULT_PROMPT);
    }
  }, []);
  
  const handleBack = () => {
    navigate('/journal-challenge');
  };
  
  const handleAcceptChallenge = () => {
    navigate('/journal-challenge');
  };
  
  const handleRestartJournalChallenge = () => {
    navigate('/journal-challenge');
  };
  
  return (
    <ChatInterface 
      type="journal" 
      onBack={handleBack}
      onAcceptChallenge={handleAcceptChallenge}
      onRestart={handleRestartJournalChallenge}
      initialMessage="Welcome to your Journal Reflection. This is a place for reflection and exploration. Let's dive into today's prompt and see what insights we can uncover together."
    />
  );
};
