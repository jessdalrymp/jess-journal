
import { ArrowLeft } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";
import { useNavigate } from "react-router-dom";

interface JournalHistoryHeaderProps {
  onBackClick: () => void;
}

export const JournalHistoryHeader = ({ onBackClick }: JournalHistoryHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-6">
      <ActionButton 
        type="ghost" 
        className="mr-4" 
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </ActionButton>
      <h1 className="text-2xl font-medium">Journal History</h1>
    </div>
  );
};
