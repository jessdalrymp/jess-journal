
import { UserProfile } from '../lib/types';

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

// Memory cache for user profiles
const profileCache: Record<string, {
  data: UserProfile;
  timestamp: number;
}> = {};

export function useProfileCache() {
  const getCachedProfile = (userId: string): UserProfile | null => {
    const cachedProfile = profileCache[userId];
    if (cachedProfile && (Date.now() - cachedProfile.timestamp) < CACHE_EXPIRATION) {
      console.log('Using cached user profile');
      return cachedProfile.data;
    }
    return null;
  };

  const cacheProfile = (userId: string, profileData: UserProfile): void => {
    profileCache[userId] = {
      data: profileData,
      timestamp: Date.now()
    };
  };

  return {
    getCachedProfile,
    cacheProfile
  };
}
