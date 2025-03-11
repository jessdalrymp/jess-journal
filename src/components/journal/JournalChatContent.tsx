
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";
import { useEffect, useState } from "react";
import { DEFAULT_PROMPT, JournalPrompt } from "@/hooks/journal";

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
  
  // Generate a simplified welcome message that focuses on the prompt steps
  const generateWelcomeMessage = (prompt: JournalPrompt | null) => {
    if (!prompt) return "";
    
    // Create a more focused, step-by-step approach to the prompt
    const welcomeMessage = [
      `Welcome to your journaling session. Today's prompt is:`,
      `"${prompt.title}: ${prompt.prompt}"`,
      "",
      "Let's explore this prompt step by step:",
      "",
      ...prompt.instructions.map((instruction, index) => `${index + 1}. ${instruction}`),
      "",
      "Which part of this journaling exercise would you like to start with? Or is there a specific aspect of the prompt that interests you the most?"
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
