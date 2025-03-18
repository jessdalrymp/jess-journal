
import { User, UserProfile, ConversationSession, ChatMessage, JournalEntry } from '../lib/types';

export interface Subscription {
  id: string;
  status: string;
  is_trial: boolean;
  is_unlimited?: boolean;
  trial_ends_at?: string;
  current_period_ends_at?: string;
  coupon_code?: string;
}

export interface UserData {
  user: User | null | undefined;
  profile: UserProfile | null | undefined;
  loading: boolean;
  fetchUser: () => Promise<User | null>;
  fetchProfile: () => Promise<UserProfile | null>;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal') => Promise<ConversationSession>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
  journalEntries: JournalEntry[];
  fetchJournalEntries: (forceRefresh?: boolean) => Promise<JournalEntry[]>;
  subscription: Subscription | null;
  checkSubscriptionStatus: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
}
