
/**
 * Utility functions for interacting with localStorage
 */

import { 
  UserProfile,
  JournalEntry,
  MoodEntry,
  ActionChallenge,
  ConversationSession
} from './types';

export const getProfileFromStorage = (): UserProfile | null => {
  try {
    const storedProfile = localStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error loading profile from storage:', error);
    return null;
  }
};

export const saveProfileToStorage = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
};

export const getJournalEntriesFromStorage = (): JournalEntry[] => {
  try {
    const storedEntries = localStorage.getItem('journalEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error('Error loading journal entries from storage:', error);
    return [];
  }
};

export const saveJournalEntriesToStorage = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries to storage:', error);
  }
};

export const getMoodEntriesFromStorage = (): MoodEntry[] => {
  try {
    const storedEntries = localStorage.getItem('moodEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error('Error loading mood entries from storage:', error);
    return [];
  }
};

export const saveMoodEntriesToStorage = (entries: MoodEntry[]): void => {
  try {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving mood entries to storage:', error);
  }
};

export const getChallengesFromStorage = (): ActionChallenge[] => {
  try {
    const storedChallenges = localStorage.getItem('actionChallenges');
    return storedChallenges ? JSON.parse(storedChallenges) : [];
  } catch (error) {
    console.error('Error loading challenges from storage:', error);
    return [];
  }
};

export const saveChallengesToStorage = (challenges: ActionChallenge[]): void => {
  try {
    localStorage.setItem('actionChallenges', JSON.stringify(challenges));
  } catch (error) {
    console.error('Error saving challenges to storage:', error);
  }
};

export const getConversationsFromStorage = (): ConversationSession[] => {
  try {
    const storedConversations = localStorage.getItem('conversations');
    return storedConversations ? JSON.parse(storedConversations) : [];
  } catch (error) {
    console.error('Error loading conversations from storage:', error);
    return [];
  }
};

export const saveConversationsToStorage = (conversations: ConversationSession[]): void => {
  try {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations to storage:', error);
  }
};
