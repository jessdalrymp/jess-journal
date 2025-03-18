
import { ArrowLeft, Edit, X } from "lucide-react";
import { ActionButton } from "../ui/ActionButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface JournalEntryHeaderProps {
  isEditing: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
}

export const JournalEntryHeader = ({
  isEditing,
  onEditClick,
  onCancelEdit,
}: JournalEntryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <ActionButton 
          type="ghost" 
          className="mr-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </ActionButton>
      </div>
      
      {!isEditing ? (
        <Button onClick={onEditClick} variant="outline" className="flex items-center gap-2">
          <Edit size={16} />
          Edit
        </Button>
      ) : (
        <Button onClick={onCancelEdit} variant="outline" className="flex items-center gap-2">
          <X size={16} />
          Cancel
        </Button>
      )}
    </div>
  );
};
