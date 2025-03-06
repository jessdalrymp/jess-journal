
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { UserProfile } from "../../lib/types";

interface AssessmentSectionProps {
  profile: UserProfile | null | undefined;
  onRetakeAssessment: () => void;
}

export const AssessmentSection = ({ profile, onRetakeAssessment }: AssessmentSectionProps) => {
  return (
    <div className="p-4 border border-jess-subtle rounded-lg">
      <h3 className="font-medium mb-3">Self-Discovery Assessment</h3>
      <p className="text-sm text-jess-muted mb-3">
        {profile?.completedOnboarding 
          ? "You've completed your self-discovery assessment. You can retake it anytime."
          : "You haven't completed your self-discovery assessment yet."}
      </p>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onRetakeAssessment}
        className="flex items-center"
      >
        <RefreshCw size={14} className="mr-2" />
        {profile?.completedOnboarding ? "Retake Assessment" : "Take Assessment"}
      </Button>
    </div>
  );
};
