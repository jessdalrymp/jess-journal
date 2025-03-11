
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";
import { useEffect, useState } from "react";
import { DEFAULT_PROMPT } from "@/hooks/useJournalPrompt";

export type JournalPrompt = {
  title: string;
  prompt: string;
  instructions: string[];
};

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
  
  // Generate a welcome message with initial questions based on the prompt
  const generateWelcomeMessage = (prompt: JournalPrompt | null) => {
    if (!prompt) return "";
    
    const welcomeMessage = [
      "Welcome to your Journal Reflection space. I'm here to help you explore your thoughts on today's prompt:",
      `"${prompt.title}: ${prompt.prompt}"`,
      "",
      "Let's break this down into manageable parts. You could start by considering:",
      `• What was your initial reaction to this prompt?`,
      `• Can you recall a specific experience related to this topic?`,
      `• What emotions come up when you think about this?`,
      "",
      "Feel free to start wherever feels most comfortable for you. What aspect would you like to explore first?"
    ].join("\n");
    
    return welcomeMessage;
  };
  
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
      initialMessage={currentPrompt ? generateWelcomeMessage(currentPrompt) : undefined}
    />
  );
};
