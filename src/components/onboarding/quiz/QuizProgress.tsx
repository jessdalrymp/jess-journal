
interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const QuizProgress = ({ currentQuestion, totalQuestions }: QuizProgressProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <span className="text-sm text-jess-muted">
        Question {currentQuestion + 1} of {totalQuestions}
      </span>
      <div className="flex space-x-1">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={`h-1 w-6 rounded-full ${
              index === currentQuestion
                ? 'bg-jess-primary'
                : index < currentQuestion
                ? 'bg-jess-secondary'
                : 'bg-jess-subtle'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
