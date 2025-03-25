
import { MyStoryHeader } from "./MyStoryHeader";
import { MyStoryChatContainer } from "./MyStoryChatContainer";
import { MyStoryPriorConversations } from "./MyStoryPriorConversations";

interface MyStoryContentProps {
  existingConversationId: string | null;
  onStartFresh: () => void;
  onBack: () => void;
  onSave: (refreshData?: boolean) => void;
  priorConversations: any[];
  loadingPriorConversations: boolean;
  handleLoadConversation: (id: string) => Promise<void>;
}

export const MyStoryContent = ({
  existingConversationId,
  onStartFresh,
  onBack,
  onSave,
  priorConversations,
  loadingPriorConversations,
  handleLoadConversation
}: MyStoryContentProps) => {
  return (
    <>
      <MyStoryHeader 
        existingConversationId={existingConversationId} 
        onStartFresh={onStartFresh} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <MyStoryChatContainer 
            onBack={onBack} 
            onSave={onSave}
            conversationId={existingConversationId}
          />
        </div>
        <div className="md:col-span-1">
          <MyStoryPriorConversations
            conversations={priorConversations}
            loading={loadingPriorConversations}
            onSelectConversation={handleLoadConversation}
            currentConversationId={existingConversationId}
          />
        </div>
      </div>
    </>
  );
};
