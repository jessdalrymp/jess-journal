
import { JournalEntry } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { getEntryTitle } from "./EntryTitleUtils";

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
  onEntryClick
}: EntryItemProps) => {
  return (
    <div 
      className="border border-jess-subtle p-4 rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
      onClick={() => onEntryClick(entry)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{getEntryTitle(entry)}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-jess-muted">
              {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-xs px-2 py-1 bg-jess-subtle rounded-full">
              {entry.type}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onEditClick(e, entry)}
            className="h-8 w-8"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onDeleteClick(e, entry)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
