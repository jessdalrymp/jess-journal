
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { JournalEntry } from '@/lib/types';
import { JournalHistoryButton } from './JournalHistoryButton';
import { JournalHistoryModal } from './JournalHistoryModal';
import { getEntryTitle } from './EntryTitleUtils';

export const JournalHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { journalEntries } = useUserData();
  
  const sortedEntries = [...journalEntries].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <JournalHistoryButton onClick={handleOpenModal} />
      
      <JournalHistoryModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        entries={sortedEntries}
        getEntryTitle={getEntryTitle}
      />
    </>
  );
};
