
import { JournalEntry } from "@/lib/types";
import { parseContentWithJsonCodeBlock } from "@/services/journal";

interface JournalEntryMetaProps {
  entry: JournalEntry;
  title: string;
}

export const JournalEntryMeta = ({ entry, title }: JournalEntryMetaProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>
        <span className="text-sm px-3 py-1 bg-jess-subtle rounded-full">
          {entry.type}
        </span>
      </div>
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
