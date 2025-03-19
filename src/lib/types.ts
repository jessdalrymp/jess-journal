export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  email?: string;
  growthStage?: string;
  challenges?: string[];
  mindsetPatterns?: string[];
  learningStyle?: string;
  supportNeeds?: string[];
  communicationPreference?: string;
  engagementMode?: string;
  completedOnboarding: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  content: string;
  type: 'journal' | 'story' | 'sideQuest' | 'action';
  createdAt: Date;
  prompt?: string | null;
  summary?: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  userId: string;
  type: 'story' | 'sideQuest' | 'action' | 'journal';
  title?: string;
  messages: ChatMessage[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'growthStage' | 'challenges' | 'mindset' | 'learningStyle' | 'supportNeeds';
}

export interface ActionChallenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  deadline?: Date;
  createdAt: Date;
}
