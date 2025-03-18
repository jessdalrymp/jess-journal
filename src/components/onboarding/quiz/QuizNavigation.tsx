
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionButton } from '../../ui/ActionButton';

interface QuizNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canProceed: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  loading: boolean;
}

export const QuizNavigation = ({
  onPrevious,
  onNext,
  canProceed,
  isFirstQuestion,
  isLastQuestion,
  loading
}: QuizNavigationProps) => {
  return (
    <div className="flex justify-between">
      <ActionButton
        type="ghost"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="px-4 py-2"
        icon={<ChevronLeft size={18} />}
      >
        Previous
      </ActionButton>
      
      <ActionButton
        type="primary"
        onClick={onNext}
        disabled={!canProceed || loading}
        className="px-4 py-2"
        icon={isLastQuestion ? undefined : <ChevronRight size={18} />}
      >
        {loading
          ? 'Processing...'
          : isLastQuestion
            ? 'Complete'
            : 'Next'
        }
      </ActionButton>
    </div>
  );
};
