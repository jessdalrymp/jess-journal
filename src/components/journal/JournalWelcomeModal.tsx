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
  // We're keeping the component as is because it's controlled by its parent
  // This welcome modal is different from the dashboard welcome popup -
  // it's only shown when explicitly triggered by its parent component
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
