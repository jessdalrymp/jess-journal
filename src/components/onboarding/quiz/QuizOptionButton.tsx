
import { Check } from 'lucide-react';

interface QuizOptionButtonProps {
  option: string;
  isSelected: boolean;
  onClick: () => void;
}

export const QuizOptionButton = ({ option, isSelected, onClick }: QuizOptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? 'border-jess-primary bg-jess-primary/10'
          : 'border-jess-subtle hover:border-jess-secondary'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
          isSelected
            ? 'border-jess-primary bg-jess-primary text-white'
            : 'border-jess-muted'
        }`}>
          {isSelected && <Check size={12} />}
        </div>
        <span>{option}</span>
      </div>
    </button>
  );
};
