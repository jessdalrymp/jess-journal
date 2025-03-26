
import { JournalEntry } from "@/lib/types";
import { Edit, Trash2, MessageSquare } from "lucide-react";
import { getEntryIcon } from "./JournalHistoryUtils";
import { getEntryTitle } from "./EntryTitleUtils";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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
  const entryType = entry.type || 'story';
  const isConversation = !!entry.conversation_id;
  
  // Format date with date-fns
  const formattedDate = formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true });
  
  // Get a preview of the content
  const contentPreview = entry.content.length > 150 
    ? entry.content.substring(0, 150) + '...' 
    : entry.content;

  return (
    <div 
      className="p-4 border rounded-lg hover:border-jess-primary transition-colors cursor-pointer bg-gradient-to-br from-white to-blue-50"
      onClick={() => onEntryClick(entry)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <span>{getEntryIcon(entryType)}</span>
          <h3 className="font-medium">{getEntryTitle(entry)}</h3>
          <div className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
            <MessageSquare size={12} className="mr-1" />
            <span>Conversation</span>
          </div>
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
        {contentPreview}
      </div>
      <div className="mt-2 text-xs text-blue-600 flex items-center">
        <MessageSquare size={14} className="mr-1" />
        <span>View full conversation</span>
      </div>
    </div>
  );
};
