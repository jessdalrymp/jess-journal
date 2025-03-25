
import { JournalEntry } from "@/lib/types";
import { JournalHistoryHeader } from "@/components/journal/JournalHistoryHeader";
import { JournalActions } from "@/components/journal/JournalActions";
import { JournalEntryGrid } from "@/components/journal/JournalEntryGrid";

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
  // Log entries for debugging
  console.log(`JournalHistory - Rendering ${entries.length} entries`);
  console.log('JournalHistory - Types breakdown:', 
    entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );
  console.log('JournalHistory - Conversation entries:', 
    entries.filter(e => e.conversation_id).length
  );
  
  // Filter to ensure we have all entries with conversation_id
  const conversationEntries = entries.filter(e => e.conversation_id);
  console.log('JournalHistory - Conversation entries details:', 
    conversationEntries.map(e => ({
      id: e.id,
      type: e.type,
      title: e.title,
      conversationId: e.conversation_id
    }))
  );
  
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
      
      <JournalEntryGrid
        entries={entries}
        onEntryClick={onEntryClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        isLoading={isLoading}
      />
    </>
  );
};
