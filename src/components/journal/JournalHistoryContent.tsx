
import { JournalEntry } from "@/lib/types";
import { JournalHistoryHeader } from "@/components/journal/JournalHistoryHeader";
import { JournalActions } from "@/components/journal/JournalActions";
import { JournalEntryGrid } from "@/components/journal/JournalEntryGrid";
import { useEffect, useState } from "react";

interface JournalHistoryContentProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryClick: (entry: JournalEntry) => void;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onNewEntry: () => void;
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
  onRefresh,
  onBackClick
}: JournalHistoryContentProps) => {
  const [renderedEntries, setRenderedEntries] = useState<JournalEntry[]>([]);
  
  // Only update entries when they change, don't refresh while on page
  useEffect(() => {
    if (entries.length > 0) {
      // Sort entries by date (newest first) to ensure proper ordering
      const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setRenderedEntries(sortedEntries);
    } else {
      setRenderedEntries([]);
    }
  }, [entries]);
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <JournalHistoryHeader onBackClick={onBackClick} />
        <JournalActions 
          onNewEntry={onNewEntry} 
          onRefresh={onRefresh}
          isLoading={isLoading} 
        />
      </div>
      
      <JournalEntryGrid
        entries={renderedEntries}
        onEntryClick={onEntryClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </>
  );
};
