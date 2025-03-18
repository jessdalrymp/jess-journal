
import { X } from 'lucide-react';
import { useState } from 'react';
import { JournalEntry } from '@/lib/types';
import { JournalHistoryEntryItem } from './JournalHistoryEntryItem';
import { JournalHistoryEntryDetail } from './JournalHistoryEntryDetail';
import { JournalHistoryEmptyState } from './JournalHistoryEmptyState';

interface JournalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  getEntryTitle: (entry: JournalEntry) => string;
}

export const JournalHistoryModal = ({
  isOpen,
  onClose,
  entries,
  getEntryTitle
}: JournalHistoryModalProps) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
  };

  const handleBackToList = () => {
    setSelectedEntry(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-xl animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-jess-subtle">
          <h2 className="text-xl font-medium">
            {selectedEntry ? getEntryTitle(selectedEntry) : 'Journal History'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-jess-subtle transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {selectedEntry ? (
            <JournalHistoryEntryDetail
              entry={selectedEntry}
              getEntryTitle={getEntryTitle}
              onBack={handleBackToList}
            />
          ) : (
            <div className="space-y-3">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <JournalHistoryEntryItem
                    key={entry.id}
                    entry={entry}
                    getEntryTitle={getEntryTitle}
                    onSelect={handleSelectEntry}
                  />
                ))
              ) : (
                <JournalHistoryEmptyState />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
