
import { useState } from 'react';
import { useUserData } from '../../../context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../../context/AuthContext';
import { questions, QuizQuestion } from './quizQuestions';

type Answers = Record<string, string | string[]>;

export const useQuiz = (onComplete: () => void) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const { saveProfile } = useUserData();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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
  const isMultiSelect = question?.multiSelect || false;
  const selectedAnswers = answers[question?.id] || (isMultiSelect ? [] : '');

  const isOptionSelected = (option: string) => {
    if (isMultiSelect) {
      return (selectedAnswers as string[]).includes(option);
    }
    return selectedAnswers === option;
  };

  const canProceed = isMultiSelect 
    ? (selectedAnswers as string[]).length > 0
    : !!selectedAnswers;

  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return {
    currentQuestion,
    question,
    answers,
    isMultiSelect,
    selectedAnswers,
    loading,
    isOptionSelected,
    canProceed,
    isFirstQuestion,
    isLastQuestion,
    questions,
    handleAnswer,
    handleNext,
    handlePrevious
  };
};
