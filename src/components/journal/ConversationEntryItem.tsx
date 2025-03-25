
import { JournalEntry } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getEntryIcon } from "./JournalHistoryUtils";
import { getEntryTitle } from "./EntryTitleUtils";
import { getContentPreview } from "@/utils/contentParser";
import { EntryActions } from "./EntryActions";

interface ConversationEntryItemProps {
  entry: JournalEntry;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onEntryClick: (entry: JournalEntry) => void;
}

export const ConversationEntryItem = ({
  entry,
  onEditClick,
  onDeleteClick,
  onEntryClick,
}: ConversationEntryItemProps) => {
  const entryType = entry.type || 'journal';
  const content = getContentPreview(entry);
  const formattedDate = formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true });

  console.log(`ConversationEntryItem - Rendering conversation entry: ${entry.id}, type: ${entryType}`);

  return (
    <div 
      className="p-4 border-l-4 border-l-blue-400 border border-blue-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-blue-50/30"
      onClick={() => onEntryClick(entry)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <MessageCircle className="text-blue-600" size={18} />
          <h3 className="font-medium">{getEntryTitle(entry)}</h3>
          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            <MessageCircle size={12} className="mr-1" />
            Conversation
          </span>
        </div>
        
        <EntryActions 
          entry={entry} 
          onEditClick={onEditClick} 
          onDeleteClick={onDeleteClick} 
        />
      </div>
      
      <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>
      
      <div className="text-sm line-clamp-3 bg-white p-2 rounded border border-blue-100">
        {content}
      </div>
    </div>
  );
};
