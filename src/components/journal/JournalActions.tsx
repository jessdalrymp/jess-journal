
import { Button } from "@/components/ui/button";
import { Plus, Pencil, RefreshCw } from "lucide-react";

interface JournalActionsProps {
  onNewEntry: () => void;
  onWriteFreely: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const JournalActions = ({
  onNewEntry,
  onWriteFreely,
  onRefresh,
  isLoading
}: JournalActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={onNewEntry} 
        variant="default" 
        className="flex items-center gap-2 bg-jess-primary hover:bg-jess-primary/90"
      >
        <Plus size={16} />
        New Entry
      </Button>
      <Button 
        onClick={onWriteFreely} 
        variant="default" 
        className="flex items-center gap-2 bg-jess-primary hover:bg-jess-primary/90"
      >
        <Pencil size={16} />
        Write Freely
      </Button>
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isLoading}
      >
        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        Refresh
      </Button>
    </div>
  );
};
