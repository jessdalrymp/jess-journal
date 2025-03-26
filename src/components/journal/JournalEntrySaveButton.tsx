
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface JournalEntrySaveButtonProps {
  onSave: () => Promise<void | boolean>;
  isSaving: boolean;
  onSaveAndClose?: () => Promise<void | boolean>;
}

export const JournalEntrySaveButton = ({ 
  onSave, 
  isSaving,
  onSaveAndClose
}: JournalEntrySaveButtonProps) => {
  return (
    <div className="mt-6 flex justify-end gap-3">
      {onSaveAndClose && (
        <Button 
          onClick={onSaveAndClose} 
          disabled={isSaving}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save & Close"}
        </Button>
      )}
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
