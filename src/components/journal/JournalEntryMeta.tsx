
import { JournalEntry } from "@/lib/types";

interface JournalEntryMetaProps {
  entry: JournalEntry;
}

export const JournalEntryMeta = ({ entry }: JournalEntryMetaProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
        {entry.type}
      </span>
      <p className="text-sm text-jess-muted">
        {new Date(entry.createdAt).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  );
};
