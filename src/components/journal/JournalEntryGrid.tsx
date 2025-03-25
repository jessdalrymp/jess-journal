
import { JournalEntry } from "@/lib/types";
import { EntryList } from "@/components/journal/EntryList";

interface JournalEntryGridProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryClick: (entry: JournalEntry) => void;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
}

export const JournalEntryGrid = ({
  entries,
  isLoading,
  onEntryClick,
  onEditClick,
  onDeleteClick
}: JournalEntryGridProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <EntryList 
        entries={entries}
        onEntryClick={onEntryClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </div>
  );
};
