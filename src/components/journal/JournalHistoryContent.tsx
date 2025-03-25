
import { JournalEntry } from "@/lib/types";
import { EntryList } from "@/components/journal/EntryList";
import { JournalHistoryHeader } from "@/components/journal/JournalHistoryHeader";
import { JournalActions } from "@/components/journal/JournalActions";

interface JournalHistoryContentProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryClick: (entry: JournalEntry) => void;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onNewEntry: () => void;
  onWriteFreely: () => void;
  onRefresh: () => void;
  onBackClick: () => void;
}

export const JournalHistoryContent = ({
  entries,
  isLoading,
  onEntryClick,
  onEditClick,
  onDeleteClick,
  onNewEntry,
  onWriteFreely,
  onRefresh,
  onBackClick
}: JournalHistoryContentProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <JournalHistoryHeader onBackClick={onBackClick} />
        <JournalActions 
          onNewEntry={onNewEntry} 
          onWriteFreely={onWriteFreely} 
          onRefresh={onRefresh}
          isLoading={isLoading} 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <EntryList 
          entries={entries}
          onEntryClick={onEntryClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
