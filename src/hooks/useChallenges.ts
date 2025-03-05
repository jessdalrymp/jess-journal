
import { useState } from 'react';
import { ActionChallenge } from '../lib/types';
import { getChallengesFromStorage, saveChallengesToStorage } from '../lib/storageUtils';

export const useChallenges = (userId: string | undefined) => {
  const [challenges, setChallenges] = useState<ActionChallenge[]>([]);

  const loadChallenges = () => {
    if (!userId) {
      setChallenges([]);
      return;
    }

    try {
      const storedChallenges = getChallengesFromStorage();
      setChallenges(storedChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const createChallenge = async (challenge: Omit<ActionChallenge, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) throw new Error('User not authenticated');
    
    const newChallenge: ActionChallenge = {
      id: Date.now().toString(),
      userId,
      createdAt: new Date(),
      ...challenge,
    };
    
    const updatedChallenges = [...challenges, newChallenge];
    saveChallengesToStorage(updatedChallenges);
    setChallenges(updatedChallenges);
    
    return newChallenge;
  };

  const updateChallenge = async (id: string, update: Partial<ActionChallenge>) => {
    if (!userId) throw new Error('User not authenticated');
    
    const challengeIndex = challenges.findIndex(c => c.id === id);
    if (challengeIndex === -1) throw new Error('Challenge not found');
    
    const updatedChallenge = {
      ...challenges[challengeIndex],
      ...update,
    };
    
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex] = updatedChallenge;
    
    saveChallengesToStorage(updatedChallenges);
    setChallenges(updatedChallenges);
  };

  return {
    challenges,
    loadChallenges,
    createChallenge,
    updateChallenge
  };
};
