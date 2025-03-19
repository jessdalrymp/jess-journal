
import { JournalEntry } from "@/lib/types";
import { JournalEntryMeta } from "./JournalEntryMeta";
import { JournalEntryContent } from "./JournalEntryContent";
import { JournalEntryEditor } from "./JournalEntryEditor";
import { JournalEntrySaveButton } from "./JournalEntrySaveButton";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface JournalEntryViewProps {
  entry: JournalEntry;
  parsedContent: { title?: string; summary?: string } | null;
  isEditing: boolean;
  editableTitle: string;
  editableContent: string;
  setEditableTitle: (title: string) => void;
  setEditableContent: (content: string) => void;
  handleSaveClick: () => Promise<void>;
  isSaving: boolean;
}

export const JournalEntryView = ({
  entry,
  parsedContent,
  isEditing,
  editableTitle,
  editableContent,
  setEditableTitle,
  setEditableContent,
  handleSaveClick,
  isSaving,
}: JournalEntryViewProps) => {
  const isConversationSummary = !!entry.conversation_id;

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <article className="bg-white rounded-xl shadow-sm p-6 mb-6">
        {isEditing ? (
          <>
            <JournalEntryEditor
              title={editableTitle}
              content={editableContent}
              onTitleChange={setEditableTitle}
              onChange={setEditableContent}
            />
            <div className="mt-6">
              <JournalEntrySaveButton onSave={handleSaveClick} isSaving={isSaving} />
            </div>
          </>
        ) : (
          <>
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-jess-foreground mb-2">
                {parsedContent?.title || entry.title || "Journal Entry"}
              </h1>
              <JournalEntryMeta 
                entry={entry} 
                title={parsedContent?.title || entry.title || "Journal Entry"} 
              />
            </header>
            
            <JournalEntryContent entry={entry} parsedContent={parsedContent} />
            
            {isConversationSummary && (
              <div className="mt-6">
                <Link to={`/my-story?conversationId=${entry.conversation_id}`}>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    View Full Conversation
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </article>
    </div>
  );
};
