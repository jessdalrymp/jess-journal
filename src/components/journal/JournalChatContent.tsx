
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../chat/ChatInterface";

export const JournalChatContent = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/journal-challenge');
  };
  
  const handleRestartJournalChallenge = () => {
    navigate('/journal-challenge');
  };
  
  return (
    <ChatInterface 
      type="journal" 
      onBack={handleBack}
      onRestart={handleRestartJournalChallenge}
    />
  );
};
