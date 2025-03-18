
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from './quiz/useQuiz';
import { QuizProgress } from './quiz/QuizProgress';
import { QuizQuestion } from './quiz/QuizQuestion';
import { QuizNavigation } from './quiz/QuizNavigation';

export const SelfDiscoveryQuiz = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const {
    currentQuestion,
    question,
    loading,
    isOptionSelected,
    canProceed,
    isFirstQuestion,
    isLastQuestion,
    questions,
    handleAnswer,
    handleNext,
    handlePrevious
  } = useQuiz(onComplete);

  useEffect(() => {
    if (user) {
      // Handle user authentication logic here
    }
  }, [user]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-jess-primary">Self-Discovery Quiz</h1>
        <p className="text-jess-muted">
          Help us personalize your experience. Your answers will shape how JESS interacts with you.
        </p>
      </div>
      
      <div className="card-base">
        <QuizProgress 
          currentQuestion={currentQuestion} 
          totalQuestions={questions.length} 
        />
        
        <QuizQuestion
          question={question}
          isOptionSelected={isOptionSelected}
          onSelectOption={handleAnswer}
        />
        
        <QuizNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canProceed={canProceed}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          loading={loading}
        />
      </div>
    </div>
  );
};
