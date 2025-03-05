
/**
 * Utility functions for interacting with localStorage
 */

import { 
  UserProfile,
  JournalEntry,
  MoodEntry
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

export const saveMoodEntriesToStorage = (entries: MoodEntry[]): void => {
  try {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving mood entries to storage:', error);
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

export const saveJournalEntriesToStorage = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries to storage:', error);
  }
};
