
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChallengeSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartJournaling: () => void;
}

export const ChallengeSuccessDialog = ({
  open,
  onOpenChange,
}: ChallengeSuccessDialogProps) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-2">Challenge Accepted! 🎉</DialogTitle>
          <DialogDescription className="text-center">
            Great job taking this step toward personal growth! 
            After you've completed the challenge, return here to journal about your experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mt-4">
          <div className="bg-jess-subtle p-4 rounded-lg mb-6 text-center">
            <p>Remember: the most powerful insights often come from reflecting on your experience.</p>
          </div>
          
          <Button
            onClick={handleReturnHome}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Return to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
