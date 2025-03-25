
import { JournalEntry } from "@/lib/types";
import { EntryListEmptyState } from "@/components/journal/EntryListEmptyState";
import { EntryListLoading } from "@/components/journal/EntryListLoading";
import { EntryItem } from "@/components/journal/EntryItem";
import { ConversationEntryItem } from "@/components/journal/ConversationEntryItem";

interface EntryListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryClick: (entry: JournalEntry) => void;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
}

export const EntryList = ({
  entries,
  isLoading,
  onEntryClick,
  onEditClick,
  onDeleteClick
}: EntryListProps) => {
  // Log entries for debugging
  console.log(`EntryList - Found ${entries.length} entries including ${entries.filter(e => e.conversation_id).length} conversation entries`);

  if (isLoading) {
    return <EntryListLoading />;
  }

  if (entries.length === 0) {
    return <EntryListEmptyState />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        entry.conversation_id ? (
          <ConversationEntryItem
            key={entry.id}
            entry={entry}
            onEntryClick={onEntryClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ) : (
          <EntryItem
            key={entry.id}
            entry={entry}
            onEntryClick={onEntryClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )
      ))}
    </div>
  );
};
