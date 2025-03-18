
export type QuizCategory = 'growthStage' | 'challenges' | 'mindset' | 'learningStyle' | 'supportNeeds';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: QuizCategory;
  multiSelect?: boolean;
}

export const questions: QuizQuestion[] = [
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
