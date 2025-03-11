
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";

interface JournalHistoryHeaderProps {
  onBackClick: () => void;
}

export const JournalHistoryHeader = ({ onBackClick }: JournalHistoryHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <ActionButton 
        type="ghost" 
        className="mr-4" 
        onClick={onBackClick}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back
      </ActionButton>
      <h1 className="text-2xl font-medium">Journal History</h1>
    </div>
  );
};
