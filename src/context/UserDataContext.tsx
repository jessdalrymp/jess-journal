
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  UserProfile,
  JournalEntry,
  MoodEntry,
  ConversationSession,
  ActionChallenge,
  MoodType
} from '../lib/types';
import { useProfile } from '../hooks/useProfile';
import { useJournalEntries } from '../hooks/useJournalEntries';
import { useMoodEntries } from '../hooks/useMoodEntries';
import { useConversations } from '../hooks/useConversations';
import { useChallenges } from '../hooks/useChallenges';

interface UserDataContextType {
  profile: UserProfile | null;
  journalEntries: JournalEntry[];
  moodEntries: MoodEntry[];
  conversations: ConversationSession[];
  challenges: ActionChallenge[];
  loading: boolean;
  saveProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) => Promise<JournalEntry>;
  addMoodEntry: (mood: MoodType, note?: string) => Promise<MoodEntry>;
  startConversation: (type: 'story' | 'sideQuest' | 'action' | 'journal', title?: string) => Promise<ConversationSession>;
  addMessageToConversation: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
  createChallenge: (challenge: Omit<ActionChallenge, 'id' | 'userId' | 'createdAt'>) => Promise<ActionChallenge>;
  updateChallenge: (id: string, update: Partial<ActionChallenge>) => Promise<void>;
}

const defaultUserDataContext: UserDataContextType = {
  profile: null,
  journalEntries: [],
  moodEntries: [],
  conversations: [],
  challenges: [],
  loading: true,
  saveProfile: async () => {},
  addJournalEntry: async () => ({ id: '', userId: '', title: '', content: '', type: 'journal', createdAt: new Date() }),
  addMoodEntry: async () => ({ id: '', userId: '', mood: 'neutral', createdAt: new Date() }),
  startConversation: async () => ({ 
    id: '', 
    userId: '', 
    type: 'story', 
    messages: [], 
    createdAt: new Date(), 
    updatedAt: new Date() 
  }),
  addMessageToConversation: async () => {},
  createChallenge: async () => ({ 
    id: '', 
    userId: '', 
    title: '', 
    description: '', 
    completed: false, 
    createdAt: new Date() 
  }),
  updateChallenge: async () => {},
};

const UserDataContext = createContext<UserDataContextType>(defaultUserDataContext);

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Initialize hooks with user ID
  const { 
    profile, 
    loadProfile, 
    saveProfile 
  } = useProfile(user?.id);
  
  const { 
    journalEntries, 
    loadJournalEntries, 
    addJournalEntry 
  } = useJournalEntries(user?.id);
  
  const { 
    moodEntries, 
    loadMoodEntries, 
    addMoodEntry 
  } = useMoodEntries(user?.id);
  
  const { 
    conversations, 
    loadConversations, 
    startConversation, 
    addMessageToConversation 
  } = useConversations(user?.id);
  
  const { 
    challenges, 
    loadChallenges, 
    createChallenge, 
    updateChallenge 
  } = useChallenges(user?.id);

  // Load data from localStorage on mount or when user changes
  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      
      if (user) {
        loadProfile();
        loadJournalEntries();
        loadMoodEntries();
        loadConversations();
        loadChallenges();
      } else {
        // Reset state if user is logged out
      }
      
      setLoading(false);
    };
    
    loadUserData();
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        profile,
        journalEntries,
        moodEntries,
        conversations,
        challenges,
        loading,
        saveProfile,
        addJournalEntry,
        addMoodEntry,
        startConversation,
        addMessageToConversation,
        createChallenge,
        updateChallenge,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
