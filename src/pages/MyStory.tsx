
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { SaveChatDialog } from "../components/chat/SaveChatDialog";
import { MyStoryLoading } from "../components/my-story/MyStoryLoading";
import { MyStoryUnauthenticated } from "../components/my-story/MyStoryUnauthenticated";
import { MyStoryHeader } from "../components/my-story/MyStoryHeader";
import { MyStoryChatContainer } from "../components/my-story/MyStoryChatContainer";
import { useMyStoryState } from "../components/my-story/useMyStoryState";

const MyStory = () => {
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    showSaveChatDialog,
    setShowSaveChatDialog,
    isLoading,
    userLoading,
    existingConversationId,
    user,
    handleBack,
    handleSaveChat,
    handleStartFresh,
    refreshDataOnSave
  } = useMyStoryState();
  
  if (userLoading || isLoading) {
    return <MyStoryLoading />;
  }

  if (!user) {
    return <MyStoryUnauthenticated />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        <MyStoryHeader 
          existingConversationId={existingConversationId} 
          onStartFresh={handleStartFresh} 
        />
        <MyStoryChatContainer 
          onBack={handleBack} 
          onSave={handleSaveChat}
          conversationId={existingConversationId}
        />
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal 
        open={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal}
        title="Welcome to Your Story" 
        description="Let's get to know you better"
        buttonText="Let's Begin"
        type="story"
      />

      <SaveChatDialog
        open={showSaveChatDialog}
        onOpenChange={setShowSaveChatDialog}
        refreshData={refreshDataOnSave}
        persistConversation={true}
      />
    </div>
  );
};

export default MyStory;
