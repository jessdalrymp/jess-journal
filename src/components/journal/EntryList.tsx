
import { JournalEntry } from "../../lib/types";
import { EntryItem } from "./EntryItem";
import { EntryListEmptyState } from "./EntryListEmptyState";
import { EntryListLoading } from "./EntryListLoading";

interface EntryListProps {
  entries: JournalEntry[];
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onEntryClick: (entry: JournalEntry) => void;
  isLoading: boolean;
}

export const EntryList = ({
  entries,
  onEditClick,
  onDeleteClick,
  onEntryClick,
  isLoading
}: EntryListProps) => {
  if (isLoading) {
    return <EntryListLoading />;
  }

  if (entries.length === 0) {
    return <EntryListEmptyState />;
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <EntryItem 
          key={entry.id}
          entry={entry}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onEntryClick={onEntryClick}
        />
      ))}
    </div>
  );
};
