
import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry, UserProfile, User } from '../lib/types';
import { UserDataContext } from './UserDataContext';
import { useUserActions } from '../hooks/useUserActions';
import { useJournalEntries } from '../hooks/journal';
import { useConversationData } from '../hooks/useConversationData';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '@/components/ui/use-toast';

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  // User data
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const userActions = useUserActions();
  
  // Journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalFetched, setIsJournalFetched] = useState(false);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const isFetchingJournalRef = useRef(false);
  
  const { fetchJournalEntries: fetchEntries, loading: journalActionsLoading } = useJournalEntries();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversationData(user?.id);
  const { subscription, loading: subscriptionLoading, checkSubscriptionStatus, applyCoupon } = useSubscription(user?.id);
  const { toast } = useToast();
  
  // Combined loading state
  const loading = isLoadingUser || isLoadingProfile || isJournalLoading || conversationLoading || subscriptionLoading || journalActionsLoading;

  // Fetch user data
  const fetchUser = async (): Promise<User | null> => {
    try {
      setIsLoadingUser(true);
      const userData = await userActions.fetchUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Error loading user data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Fetch user profile
  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      setIsLoadingProfile(true);
      const profileData = await userActions.fetchProfile(user.id);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoadingProfile(false);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Save user profile
  const saveProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      const updatedProfile = await userActions.saveProfile(user.id, profileData);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchJournalEntries = async (forceRefresh: boolean = false): Promise<JournalEntry[]> => {
    if (!user) return [];
    
    // If already fetching, don't start another fetch unless force refresh is requested
    if (isFetchingJournalRef.current && !forceRefresh) {
      console.log("Journal entries already being fetched, skipping redundant fetch");
      return journalEntries;
    }
    
    isFetchingJournalRef.current = true;
    setIsJournalLoading(true);
    
    try {
      console.log("Fetching journal entries for user:", user.id, forceRefresh ? "(forced refresh)" : "");
      const entries = await fetchEntries(user.id, forceRefresh);
      setJournalEntries(entries);
      setIsJournalFetched(true);
      console.log("Successfully fetched", entries.length, "journal entries");
      return entries;
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast({
        title: "Error loading journal entries",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
      return [];
    } finally {
      isFetchingJournalRef.current = false;
      setIsJournalLoading(false);
    }
  };

  // Only fetch journal entries when user is loaded and entries haven't been fetched yet
  useEffect(() => {
    if (user && !isJournalFetched && !isFetchingJournalRef.current) {
      console.log("Triggering journal entries fetch");
      fetchJournalEntries();
      checkSubscriptionStatus();
    }
  }, [user, isJournalFetched]);

  const handleAddMessageToConversation = async (conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> => {
    try {
      await addMessageToConversation(conversationId, content, role);
      
      if (role === 'assistant') {
        if (!isFetchingJournalRef.current && user) {
          setIsJournalFetched(false);
          await fetchJournalEntries(true); // Force refresh after assistant message
        }
      }
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      toast({
        title: "Error saving message",
        description: "Your message might not have been saved",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
    startConversation,
    addMessageToConversation: handleAddMessageToConversation,
    journalEntries,
    fetchJournalEntries,
    subscription,
    checkSubscriptionStatus,
    applyCoupon
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
