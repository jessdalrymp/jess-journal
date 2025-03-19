
import { Button } from "../../components/ui/button";

interface MyStoryHeaderProps {
  existingConversationId: string | null;
  onStartFresh: () => void;
}

export const MyStoryHeader = ({ existingConversationId, onStartFresh }: MyStoryHeaderProps) => {
  return (
    <div className="flex justify-between items-center my-4">
      <h1 className="text-2xl font-medium">Let's Get to Know You</h1>
      {existingConversationId && (
        <Button variant="outline" size="sm" onClick={onStartFresh}>
          Start Fresh Conversation
        </Button>
      )}
    </div>
  );
};
