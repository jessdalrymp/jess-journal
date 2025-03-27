
import { Dialog } from "@/components/ui/dialog";
import { useSaveDialog } from "./save-dialog/useSaveDialog";
import { SaveDialogContent } from "./save-dialog/SaveDialogContent";

interface SaveChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshData?: boolean;
  persistConversation?: boolean;
}

export function SaveChatDialog({ 
  open, 
  onOpenChange, 
  refreshData = false,
  persistConversation = false
}: SaveChatDialogProps) {
  const {
    conversationTitle,
    setConversationTitle,
    isSaving,
    generating,
    saveComplete,
    handleSave,
    handleCancel
  } = useSaveDialog(open, onOpenChange, refreshData, persistConversation);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSaving && !saveComplete) {
        onOpenChange(newOpen);
      }
    }}>
      <SaveDialogContent
        conversationTitle={conversationTitle}
        setConversationTitle={setConversationTitle}
        isSaving={isSaving}
        generating={generating}
        saveComplete={saveComplete}
        persistConversation={persistConversation}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </Dialog>
  );
}
