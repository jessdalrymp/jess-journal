
import { createContext, useContext } from 'react';
import { JournalEntry, User, UserProfile } from '../lib/types';

interface UserDataContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  fetchUser: () => Promise<User | null>;
  fetchProfile: () => Promise<UserProfile | null>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<any>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<boolean>;
  journalEntries: JournalEntry[];
  fetchJournalEntries: () => Promise<JournalEntry[]>;
  subscription: any;
  checkSubscriptionStatus: () => Promise<any>;
  applyCoupon: (code: string) => Promise<any>;
}

export const UserDataContext = createContext<UserDataContextType>({
  user: null,
  profile: null,
  loading: false,
  fetchUser: async () => null,
  fetchProfile: async () => null,
  saveProfile: async () => {},
  startConversation: async () => ({}),
  addMessageToConversation: async () => false,
  journalEntries: [],
  fetchJournalEntries: async () => [],
  subscription: null,
  checkSubscriptionStatus: async () => null,
  applyCoupon: async () => null,
});

export const useUserData = () => useContext(UserDataContext);
