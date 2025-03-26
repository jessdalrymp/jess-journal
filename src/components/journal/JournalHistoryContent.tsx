
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
  
  // Any time entries prop changes, update rendering and log details
  useEffect(() => {
    // Log entries for debugging
    console.log(`JournalHistory - Processing ${entries.length} entries for display`);
    
    if (entries.length > 0) {
      // Ensure we properly convert all dates
      const processedEntries = entries.map(entry => ({
        ...entry,
        createdAt: entry.createdAt instanceof Date ? entry.createdAt : new Date(entry.createdAt)
      }));
      
      // Sort entries by date (newest first) to ensure proper ordering
      const sortedEntries = [...processedEntries].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      // Log the date range of entries for debugging date filtering issues
      const newestDate = sortedEntries[0].createdAt;
      const oldestDate = sortedEntries[sortedEntries.length - 1].createdAt;
      
      console.log('JournalHistory - Entries date range:', {
        newest: newestDate.toISOString(),
        oldest: oldestDate.toISOString(),
        count: sortedEntries.length
      });
      
      // Log the first 5 entries for debugging
      console.log('JournalHistory - First 5 entries:', sortedEntries.slice(0, 5).map(e => ({
        id: e.id,
        title: e.title?.substring(0, 30) + '...',
        type: e.type,
        date: new Date(e.createdAt).toISOString(),
        conversationId: e.conversation_id
      })));
      
      // Log entries by type for debugging
      console.log('JournalHistory - Types breakdown:', 
        sortedEntries.reduce((acc, entry) => {
          acc[entry.type] = (acc[entry.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
      
      // Log conversation entries
      const conversationEntries = sortedEntries.filter(e => e.conversation_id);
      console.log('JournalHistory - Conversation entries count:', conversationEntries.length);
      
      if (conversationEntries.length > 0) {
        console.log('JournalHistory - Conversation entries details:', 
          conversationEntries.map(e => ({
            id: e.id,
            type: e.type,
            title: e.title,
            date: new Date(e.createdAt).toISOString(),
            conversationId: e.conversation_id
          }))
        );
      }
      
      setRenderedEntries(sortedEntries);
    } else {
      console.log('JournalHistory - No entries to display');
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
