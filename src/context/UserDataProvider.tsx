
import React from 'react';
import { UserDataContext } from './UserDataContext';
import { UserProvider, useUser } from './providers/UserProvider';
import { ProfileProvider, useProfile } from './providers/ProfileProvider';
import { JournalProvider, useJournal } from './providers/JournalProvider';
import { SubscriptionProvider, useSubscriptionContext } from './providers/SubscriptionProvider';
import { ConversationProvider, useConversation } from './providers/ConversationProvider';

interface UserDataProviderProps {
  children: React.ReactNode;
}

// This component composes all the providers
export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <UserDataComposer>
        {children}
      </UserDataComposer>
    </UserProvider>
  );
};

// This inner component receives the user context and passes it to the child providers
const UserDataComposer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: userLoading, fetchUser } = useUser();
  
  return (
    <ProfileProvider user={user}>
      <JournalProvider user={user}>
        <SubscriptionProvider user={user}>
          <ConversationProvider user={user}>
            <UserDataContextProvider 
              userLoading={userLoading}
              fetchUser={fetchUser}
            >
              {children}
            </UserDataContextProvider>
          </ConversationProvider>
        </SubscriptionProvider>
      </JournalProvider>
    </ProfileProvider>
  );
};

// This component combines all the context values into the UserDataContext
const UserDataContextProvider: React.FC<{
  children: React.ReactNode;
  userLoading: boolean;
  fetchUser: () => Promise<any>;
}> = ({ 
  children, 
  userLoading,
  fetchUser
}) => {
  const { user } = useUser();
  const { profile, loading: profileLoading, fetchProfile, saveProfile } = useProfile();
  const { journalEntries, isJournalLoading, fetchJournalEntries } = useJournal();
  const { subscription, loading: subscriptionLoading, checkSubscriptionStatus, applyCoupon } = useSubscriptionContext();
  const { loading: conversationLoading, startConversation, addMessageToConversation } = useConversation();
  
  // Combined loading state
  const loading = userLoading || profileLoading || isJournalLoading || conversationLoading || subscriptionLoading;

  const value = {
    user,
    profile,
    loading,
    fetchUser,
    fetchProfile,
    saveProfile,
    startConversation,
    addMessageToConversation,
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
