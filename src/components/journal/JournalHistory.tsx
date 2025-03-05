
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { X, BookOpen, MessageSquare, Zap, PenLine, ArrowRight, Clock, History } from 'lucide-react';
import { JournalEntry } from '@/lib/types';

const getEntryIcon = (type: string) => {
  switch (type) {
    case 'story':
      return <BookOpen size={18} className="text-blue-500" />;
    case 'sideQuest':
      return <MessageSquare size={18} className="text-purple-500" />;
    case 'action':
      return <Zap size={18} className="text-amber-500" />;
    case 'journal':
      return <PenLine size={18} className="text-green-500" />;
    default:
      return <PenLine size={18} className="text-jess-muted" />;
  }
};

const getEntryTypeName = (type: string) => {
  switch (type) {
    case 'story':
      return 'My Story';
    case 'sideQuest':
      return 'Side Quest';
    case 'action':
      return 'Action Challenge';
    case 'journal':
      return 'Journal Challenge';
    default:
      return 'Entry';
  }
};

export const JournalHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
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

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
  };

  const handleBackToList = () => {
    setSelectedEntry(null);
  };

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center">
          <History size={20} className="text-jess-primary mr-3" />
          <span>View your journal history</span>
        </div>
        <ArrowRight size={18} />
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-xl animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-jess-subtle">
              <h2 className="text-xl font-medium">
                {selectedEntry ? selectedEntry.title : 'Journal History'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-jess-subtle transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {selectedEntry ? (
                <div>
                  <div className="flex items-center text-sm text-jess-muted mb-4">
                    <span className="flex items-center mr-3">
                      {getEntryIcon(selectedEntry.type)}
                      <span className="ml-1">{getEntryTypeName(selectedEntry.type)}</span>
                    </span>
                    <span>
                      {new Date(selectedEntry.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <div className="whitespace-pre-wrap">
                    {selectedEntry.content}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleBackToList}
                      className="text-sm py-1 px-3 bg-transparent text-jess-foreground hover:bg-jess-subtle/50 rounded-full"
                    >
                      Back to list
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedEntries.length > 0 ? (
                    sortedEntries.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => handleSelectEntry(entry)}
                        className="p-4 border border-jess-subtle rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{entry.title}</h3>
                            <div className="flex items-center text-sm text-jess-muted">
                              <span className="flex items-center mr-3">
                                {getEntryIcon(entry.type)}
                                <span className="ml-1">{getEntryTypeName(entry.type)}</span>
                              </span>
                              <span>
                                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 text-jess-muted">
                      <Clock size={48} className="mx-auto opacity-50 mb-2" />
                      <p className="text-jess-muted mb-1">Your journal history will appear here</p>
                      <p className="text-sm text-jess-muted">Start a conversation to begin</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
