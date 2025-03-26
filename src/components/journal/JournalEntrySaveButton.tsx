
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface JournalEntrySaveButtonProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export const JournalEntrySaveButton = ({ 
  onSave, 
  isSaving 
}: JournalEntrySaveButtonProps) => {
  return (
    <div className="mt-6 flex justify-end">
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        className="flex items-center gap-2 bg-jess-primary hover:bg-jess-primary/90"
      >
        <Save size={16} />
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
