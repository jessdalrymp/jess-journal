
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MyStoryErrorStateProps {
  errorMessage: string;
  onBack: () => void;
  onStartFresh: () => void;
  onTryAgain: () => void;
}

export const MyStoryErrorState = ({
  errorMessage,
  onBack,
  onStartFresh,
  onTryAgain
}: MyStoryErrorStateProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">Unable to Load Conversation</h3>
      <p className="text-sm text-gray-600 mb-4">
        {errorMessage}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={onBack} variant="outline">
          Back to Dashboard
        </Button>
        <Button onClick={onStartFresh} variant="default">
          Start New Conversation
        </Button>
        <Button onClick={onTryAgain} variant="secondary">
          Try Again
        </Button>
      </div>
    </div>
  );
};
