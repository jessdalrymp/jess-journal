
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [challenges, setChallenges] = useState<ActionChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data functions (will be replaced with Supabase)
  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const updatedProfile = {
        ...profile,
        ...profileData,
        userId: user.id,
        id: profile?.id || '1',
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile as UserProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      ...entry,
    };
    
    const updatedEntries = [...journalEntries, newEntry];
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setJournalEntries(updatedEntries);
    
    return newEntry;
  };

  const addMoodEntry = async (mood: MoodType, note?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      userId: user.id,
      mood,
      note,
      createdAt: new Date(),
    };
    
    const updatedEntries = [...moodEntries, newEntry];
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    setMoodEntries(updatedEntries);
    
    return newEntry;
  };

  const startConversation = async (type: 'story' | 'sideQuest' | 'action' | 'journal', title?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const newConversation: ConversationSession = {
      id: Date.now().toString(),
      userId: user.id,
      type,
      title: title || `New ${type} - ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedConversations = [...conversations, newConversation];
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    setConversations(updatedConversations);
    
    return newConversation;
  };

  const addMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    if (!user) throw new Error('User not authenticated');
    
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    if (conversationIndex === -1) throw new Error('Conversation not found');
    
    const updatedConversation = {
      ...conversations[conversationIndex],
      messages: [
        ...conversations[conversationIndex].messages,
        {
          id: Date.now().toString(),
          role,
          content,
          timestamp: new Date(),
        },
      ],
      updatedAt: new Date(),
    };
    
    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex] = updatedConversation;
    
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    setConversations(updatedConversations);
  };

  const createChallenge = async (challenge: Omit<ActionChallenge, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const newChallenge: ActionChallenge = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date(),
      ...challenge,
    };
    
    const updatedChallenges = [...challenges, newChallenge];
    localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    setChallenges(updatedChallenges);
    
    return newChallenge;
  };

  const updateChallenge = async (id: string, update: Partial<ActionChallenge>) => {
    if (!user) throw new Error('User not authenticated');
    
    const challengeIndex = challenges.findIndex(c => c.id === id);
    if (challengeIndex === -1) throw new Error('Challenge not found');
    
    const updatedChallenge = {
      ...challenges[challengeIndex],
      ...update,
    };
    
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex] = updatedChallenge;
    
    localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    setChallenges(updatedChallenges);
  };

  // Load data from localStorage on mount or when user changes
  useEffect(() => {
    const loadUserData = () => {
      if (user) {
        try {
          // Load profile
          const storedProfile = localStorage.getItem('userProfile');
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
          } else {
            // Create default profile if none exists
            const defaultProfile: UserProfile = {
              id: '1',
              userId: user.id,
              completedOnboarding: false,
            };
            setProfile(defaultProfile);
            localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
          }
          
          // Load journal entries
          const storedEntries = localStorage.getItem('journalEntries');
          if (storedEntries) {
            setJournalEntries(JSON.parse(storedEntries));
          }
          
          // Load mood entries
          const storedMoodEntries = localStorage.getItem('moodEntries');
          if (storedMoodEntries) {
            setMoodEntries(JSON.parse(storedMoodEntries));
          }
          
          // Load conversations
          const storedConversations = localStorage.getItem('conversations');
          if (storedConversations) {
            setConversations(JSON.parse(storedConversations));
          }
          
          // Load challenges
          const storedChallenges = localStorage.getItem('challenges');
          if (storedChallenges) {
            setChallenges(JSON.parse(storedChallenges));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Reset state if user is logged out
        setProfile(null);
        setJournalEntries([]);
        setMoodEntries([]);
        setConversations([]);
        setChallenges([]);
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
