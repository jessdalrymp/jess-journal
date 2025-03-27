
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";

interface MyStoryHeaderProps {
  existingConversationId: string | null;
  onStartFresh: () => void;
}

export const MyStoryHeader = ({ existingConversationId, onStartFresh }: MyStoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center my-4">
      <h1 className="text-2xl font-medium">Let's Get to Know You</h1>
      {existingConversationId ? (
        <Button variant="outline" size="sm" onClick={onStartFresh} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Start Fresh Conversation
        </Button>
      ) : (
        <div className="text-sm text-muted-foreground">Starting a new conversation...</div>
      )}
    </div>
  );
};
