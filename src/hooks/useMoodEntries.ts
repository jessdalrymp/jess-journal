// This is a temporary placeholder file to prevent build errors
// The mood functionality has been removed

export function useMoodEntries() {
  return {
    moodEntries: [],
    loading: false,
    fetchMoodEntries: () => Promise.resolve([]),
  };
}
