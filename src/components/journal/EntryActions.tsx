
import { JournalEntry } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntryActionsProps {
  entry: JournalEntry;
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
}

export const EntryActions = ({
  entry,
  onEditClick,
  onDeleteClick
}: EntryActionsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(e, entry);
        }}
        className="h-8 w-8"
      >
        <Edit size={16} />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(e, entry);
        }}
        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 size={16} />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};
