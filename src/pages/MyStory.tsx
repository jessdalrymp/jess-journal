
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get("conversationId");
  
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
    refreshDataOnSave,
    setRefreshDataOnSave,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation,
    handleDontShowWelcomeAgain
  } = useMyStoryState();
  
  // Load conversation from URL parameter if present
  useEffect(() => {
    if (urlConversationId && user && !isLoading) {
      console.log("Found conversation ID in URL:", urlConversationId);
      handleLoadConversation(urlConversationId);
    }
  }, [urlConversationId, user, isLoading, handleLoadConversation]);
  
  if (userLoading || isLoading || isLoadingConversation) {
    return <MyStoryLoading />;
  }

  if (!user) {
    return <MyStoryUnauthenticated />;
  }

  const handleSaveChatDialogOpenChange = (open: boolean) => {
    console.log("SaveChatDialog open change:", open);
    setShowSaveChatDialog(open);
  };

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        <MyStoryHeader 
          existingConversationId={existingConversationId} 
          onStartFresh={handleStartFresh} 
        />
        
        <div className="mb-4">
          <MyStoryChatContainer 
            onBack={handleBack} 
            onSave={handleSaveChat}
            conversationId={existingConversationId}
          />
        </div>
      </main>
      <DisclaimerBanner />
      
      <WelcomeModal 
        open={showWelcomeModal} 
        onOpenChange={setShowWelcomeModal}
        title="Welcome to Your Story" 
        description="Let's get to know you better"
        buttonText="Let's Begin"
        type="story"
        onDontShowAgain={handleDontShowWelcomeAgain}
      />

      <SaveChatDialog
        open={showSaveChatDialog}
        onOpenChange={handleSaveChatDialogOpenChange}
        refreshData={refreshDataOnSave}
        persistConversation={false}  // Changed to false so it will redirect after saving
      />
    </div>
  );
};

export default MyStory;
