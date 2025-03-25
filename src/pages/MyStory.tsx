
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { MyStoryLoading } from "../components/my-story/MyStoryLoading";
import { MyStoryUnauthenticated } from "../components/my-story/MyStoryUnauthenticated";
import { MyStoryErrorState } from "../components/my-story/MyStoryErrorState";
import { MyStoryContent } from "../components/my-story/MyStoryContent";
import { useMyStoryState } from "../components/my-story/useMyStoryState";
import { useToast } from "@/hooks/use-toast";

const MyStory = () => {
  const [searchParams] = useSearchParams();
  const urlConversationId = searchParams.get("conversationId");
  const { toast } = useToast();
  
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    isLoading,
    userLoading,
    existingConversationId,
    user,
    handleBack,
    handleSaveChat,
    handleStartFresh,
    priorConversations,
    loadingPriorConversations,
    handleLoadConversation,
    isLoadingConversation,
    handleDontShowWelcomeAgain,
    conversationError,
    clearConversationError
  } = useMyStoryState();
  
  useEffect(() => {
    if (urlConversationId && user && !isLoading) {
      console.log("Found conversation ID in URL:", urlConversationId);
      handleLoadConversation(urlConversationId).catch(error => {
        console.error("Error loading conversation from URL:", error);
        toast({
          title: "Error loading conversation",
          description: "The requested conversation could not be loaded. Starting a new conversation.",
          variant: "destructive"
        });
      });
    }
  }, [urlConversationId, user, isLoading, handleLoadConversation, toast]);
  
  useEffect(() => {
    if (!isLoading && !userLoading && !isLoadingConversation) {
      console.log("MyStory: Loading complete, priorConversations:", priorConversations.length);
    }
  }, [isLoading, userLoading, isLoadingConversation, priorConversations]);
  
  if (userLoading || isLoading || isLoadingConversation) {
    return <MyStoryLoading />;
  }

  if (!user) {
    return <MyStoryUnauthenticated />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        {conversationError ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <MyStoryErrorState 
              errorMessage={conversationError}
              onBack={handleBack}
              onStartFresh={handleStartFresh}
              onTryAgain={clearConversationError}
            />
          </div>
        ) : (
          <MyStoryContent
            existingConversationId={existingConversationId}
            onStartFresh={handleStartFresh}
            onBack={handleBack}
            onSave={handleSaveChat}
            priorConversations={priorConversations}
            loadingPriorConversations={loadingPriorConversations}
            handleLoadConversation={handleLoadConversation}
          />
        )}
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
    </div>
  );
};

export default MyStory;
