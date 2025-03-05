import { useState, useEffect } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ActionButton } from '../ui/ActionButton';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const questions = [
  {
    id: 'growth-stage',
    question: 'Where would you say you are in your personal growth journey?',
    options: [
      'Just starting to explore personal development',
      'Working on specific challenges but facing obstacles',
      'Made progress but feeling stuck in certain areas',
      'Experienced with personal growth but seeking deeper insights',
      'Looking to apply my growth to help others or larger purpose'
    ],
    category: 'growthStage'
  },
  {
    id: 'challenges',
    question: 'What challenges are you most interested in addressing?',
    options: [
      'Self-doubt and confidence issues',
      'Procrastination and productivity struggles',
      'Relationship patterns and conflicts',
      'Finding purpose and meaning',
      'Managing stress and emotions'
    ],
    category: 'challenges',
    multiSelect: true
  },
  {
    id: 'mindset',
    question: 'How do you typically process setbacks or challenges?',
    options: [
      'I tend to get caught in negative thought patterns',
      'I analyze what went wrong but sometimes overthink',
      'I look for the lesson but struggle to move on quickly',
      'I adapt quickly and look for the next opportunity',
      'I see challenges as growth opportunities'
    ],
    category: 'mindset'
  },
  {
    id: 'learning-style',
    question: 'How do you prefer to learn and process new information?',
    options: [
      'Through conversation and dialogue',
      'Reading and researching thoroughly',
      'Practical, hands-on experience',
      'Visual models and frameworks',
      'Teaching concepts to others'
    ],
    category: 'learningStyle'
  },
  {
    id: 'support-needs',
    question: 'What kind of support do you respond to best?',
    options: [
      'Gentle encouragement and positivity',
      'Direct feedback and honesty',
      'Structured guidance with clear steps',
      'Thought-provoking questions',
      'Accountability and regular check-ins'
    ],
    category: 'supportNeeds',
    multiSelect: true
  }
];

export const SelfDiscoveryQuiz = ({ onComplete }: { onComplete: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { saveProfile } = useUserData();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Handle user authentication logic here
    }
  }, [user]);

  const handleAnswer = (option: string) => {
    const question = questions[currentQuestion];
    
    if (question.multiSelect) {
      // Handle multi-select questions
      const currentAnswers = answers[question.id] as string[] || [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      
      setAnswers({
        ...answers,
        [question.id]: newAnswers
      });
    } else {
      // Handle single-select questions
      setAnswers({
        ...answers,
        [question.id]: option
      });
      
      // Auto-advance for single-select questions
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Transform answers into user profile format
      const profileData = {
        growthStage: answers['growth-stage'] as string,
        challenges: answers['challenges'] as string[],
        mindsetPatterns: [answers['mindset'] as string], // Convert to array to match the UserProfile type
        learningStyle: answers['learning-style'] as string,
        supportNeeds: answers['support-needs'] as string[],
        completedOnboarding: true
      };
      
      await saveProfile(profileData);
      
      toast({
        title: "Profile created!",
        description: "Your personalized experience is ready.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentQuestion];
  const isMultiSelect = question.multiSelect;
  const selectedAnswers = answers[question.id] || (isMultiSelect ? [] : '');

  const isOptionSelected = (option: string) => {
    if (isMultiSelect) {
      return (selectedAnswers as string[]).includes(option);
    }
    return selectedAnswers === option;
  };

  const canProceed = isMultiSelect 
    ? (selectedAnswers as string[]).length > 0
    : !!selectedAnswers;

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-jess-primary">Self-Discovery Quiz</h1>
        <p className="text-jess-muted">
          Help us personalize your experience. Your answers will shape how JESS interacts with you.
        </p>
      </div>
      
      <div className="card-base">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-jess-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex space-x-1">
            {questions.map((_, index) => (
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
        
        <h2 className="text-xl font-medium mb-6 text-jess-foreground">
          {question.question}
        </h2>
        
        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                isOptionSelected(option)
                  ? 'border-jess-primary bg-jess-primary/10'
                  : 'border-jess-subtle hover:border-jess-secondary'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  isOptionSelected(option)
                    ? 'border-jess-primary bg-jess-primary text-white'
                    : 'border-jess-muted'
                }`}>
                  {isOptionSelected(option) && <Check size={12} />}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <ActionButton
            type="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2"
            icon={<ChevronLeft size={18} />}
          >
            Previous
          </ActionButton>
          
          <ActionButton
            type="primary"
            onClick={handleNext}
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
      </div>
    </div>
  );
};
