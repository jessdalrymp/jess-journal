
/**
 * Type definitions for the application
 */

// Define the User interface
export interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the UserProfile interface
export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  growthStage?: string;
  learningStyle?: string;
  challenges?: string[];
  goals?: string[];
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedOnboarding?: boolean;
  email?: string;
  communicationPreference?: string;
  supportNeeds?: string;
  engagementMode?: string;
  mindsetPatterns?: string;
}

// Define the JournalEntry interface
export interface JournalEntry {
  id: string;
  userId: string;
  prompt: string;
  content: string;
  title?: string;
  topic?: string;
  mood?: string;
  type: 'journal' | 'story' | 'sideQuest' | 'action' | 'summary';
  createdAt: Date;
  updatedAt: Date;
  conversationSummary?: string;
  conversationId?: string;
}

// Define the ActionChallenge interface
export interface ActionChallenge {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  goalId?: string;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the ChatMessage interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the ConversationSession interface
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
