
import { User, UserProfile, ConversationSession, ChatMessage, JournalEntry, MoodType, MoodEntry } from '../lib/types';

export interface UserData {
  user: User | null | undefined;
  profile: UserProfile | null | undefined;
  loading: boolean;
  fetchUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
  moodEntries: MoodEntry[];
  addMoodEntry: (mood: MoodType, note?: string) => Promise<void>;
  journalEntries: JournalEntry[];
  fetchJournalEntries: () => Promise<JournalEntry[]>;
}
