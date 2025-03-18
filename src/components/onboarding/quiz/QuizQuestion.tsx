
import { QuizQuestion as QuizQuestionType } from './quizQuestions';
import { QuizOptionButton } from './QuizOptionButton';

interface QuizQuestionProps {
  question: QuizQuestionType;
  isOptionSelected: (option: string) => boolean;
  onSelectOption: (option: string) => void;
}

export const QuizQuestion = ({ 
  question, 
  isOptionSelected, 
  onSelectOption 
}: QuizQuestionProps) => {
  return (
    <>
      <h2 className="text-xl font-medium mb-6 text-jess-foreground">
        {question.question}
      </h2>
      
      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <QuizOptionButton
            key={option}
            option={option}
            isSelected={isOptionSelected(option)}
            onClick={() => onSelectOption(option)}
          />
        ))}
      </div>
    </>
  );
};
