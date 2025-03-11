
import { Dispatch, SetStateAction } from "react";
import { WelcomeModal } from "../chat/WelcomeModal";

interface JournalWelcomeModalProps {
  showWelcome: boolean;
  setShowWelcome: Dispatch<SetStateAction<boolean>>;
}

export const JournalWelcomeModal = ({ 
  showWelcome, 
  setShowWelcome 
}: JournalWelcomeModalProps) => {
  return (
    <WelcomeModal
      open={showWelcome}
      onOpenChange={setShowWelcome}
      title="Welcome to Journal Challenge"
      description="Here you'll receive personalized writing prompts designed to help you reflect on your patterns, growth, and insights. These prompts will guide you to deeper self-awareness through regular journaling practice."
      buttonText="Let's Begin"
    />
  );
};
