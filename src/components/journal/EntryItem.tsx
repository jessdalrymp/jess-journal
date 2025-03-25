
import { JournalEntry } from "@/lib/types";
import { Edit, Trash2, MessageSquare, FileText } from "lucide-react";
import { getEntryIcon } from "./JournalHistoryUtils";
import { getEntryTitle } from "./EntryTitleUtils";
import { getContentPreview } from "@/utils/contentParser";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface EntryItemProps {
  entry: JournalEntry;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onEntryClick: (entry: JournalEntry) => void;
}

export const EntryItem = ({
  entry,
  onEditClick,
  onDeleteClick,
  onEntryClick,
}: EntryItemProps) => {
  const entryType = entry.type || 'journal';
  const content = getContentPreview(entry);
  const isConversationSummary = !!entry.conversation_id;
  const isSummary = entry.type === 'summary';
  
  // Format date with date-fns
  const formattedDate = formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true });
  
  // Log entry details for debugging
  console.log(`EntryItem - Rendering entry: ${entry.id}, type: ${entryType}, hasConversation: ${isConversationSummary}`);

  return (
    <div 
      className="p-4 border rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
      onClick={() => onEntryClick(entry)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <span>{getEntryIcon(entryType)}</span>
          <h3 className="font-medium">{getEntryTitle(entry)}</h3>
          {isConversationSummary && (
            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              <MessageSquare size={12} className="mr-1" />
              Conversation
            </span>
          )}
          {isSummary && (
            <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              <FileText size={12} className="mr-1" />
              Summary
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onEditClick(e, entry)}
            className="h-8 w-8"
          >
            <Edit size={16} />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onDeleteClick(e, entry)}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>
      <div className="text-sm line-clamp-3 bg-gray-50 p-2 rounded">
        {content}
      </div>
    </div>
  );
};
