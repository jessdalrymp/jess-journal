
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DisclaimerBanner } from "../components/ui/DisclaimerBanner";
import { WelcomeModal } from "../components/chat/WelcomeModal";
import { MyStoryLoading } from "../components/my-story/MyStoryLoading";
import { MyStoryUnauthenticated } from "../components/my-story/MyStoryUnauthenticated";
import { MyStoryHeader } from "../components/my-story/MyStoryHeader";
import { MyStoryChatContainer } from "../components/my-story/MyStoryChatContainer";
import { useMyStoryState } from "../components/my-story/useMyStoryState";
import { MyStoryPriorConversations } from "../components/my-story/MyStoryPriorConversations";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  // Load conversation from URL parameter if present
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
  
  // Refresh prior conversations when loading is complete
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

  // Show error state if there's a conversation loading error
  if (conversationError) {
    return (
      <div className="min-h-screen flex flex-col bg-jess-background">
        <Header />
        <main className="flex-1 container mx-auto flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Unable to Load Conversation</h3>
            <p className="text-sm text-gray-600 mb-4">
              {conversationError}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleBack} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={handleStartFresh} variant="default">
                Start New Conversation
              </Button>
              <Button onClick={clearConversationError} variant="secondary">
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-jess-background">
      <Header />
      <main className="flex-1 container mx-auto flex flex-col">
        <MyStoryHeader 
          existingConversationId={existingConversationId} 
          onStartFresh={handleStartFresh} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <MyStoryChatContainer 
              onBack={handleBack} 
              onSave={handleSaveChat}
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
