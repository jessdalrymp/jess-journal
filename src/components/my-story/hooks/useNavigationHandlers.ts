
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';

export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const { fetchJournalEntries } = useUserData();
  
  const handleBack = async () => {
    try {
      console.log('Refreshing journal entries before navigating back to dashboard');
      await fetchJournalEntries();
    } catch (error) {
      console.error('Error refreshing journal entries:', error);
    }
    navigate('/dashboard');
  };
  
  return {
    handleBack
  };
};
