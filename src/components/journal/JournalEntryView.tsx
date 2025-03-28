
import { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/types';
import { parseEntryContent } from '@/utils/contentParser';
import { JournalEntryContent } from './JournalEntryContent';
import { JournalEntryMeta } from './JournalEntryMeta';
import { JournalEntrySaveButton } from './JournalEntrySaveButton';
import { JournalEntryEditor } from './JournalEntryEditor';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalEntryViewProps {
  entry: JournalEntry;
  parsedContent: ReturnType<typeof parseEntryContent>;
  isEditing: boolean;
  editableTitle: string;
  editableContent: string;
  setEditableTitle: (title: string) => void;
  setEditableContent: (content: string) => void;
  handleSaveClick: () => Promise<boolean | void>;
  handleSaveAndCloseClick?: () => Promise<boolean | void>;
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
  handleSaveAndCloseClick,
  isSaving,
}: JournalEntryViewProps) => {
  const isConversationSummary = !!entry.conversation_id;
  
  // Log entries for debugging
  useEffect(() => {
    console.log('JournalEntryView - Current entry:', entry.id, 'title:', entry.title);
    console.log('JournalEntryView - Editable content length:', editableContent.length);
    console.log('JournalEntryView - Is editing:', isEditing);
  }, [entry, editableContent, isEditing]);
  
  const handleSave = async (): Promise<void> => {
    const trimmedContent = editableContent.trim();
    if (!trimmedContent) {
      return;
    }
    
    console.log('JournalEntryView - Saving entry with content length:', trimmedContent.length);
    await handleSaveClick();
  };

  const handleSaveAndClose = async (): Promise<void> => {
    const trimmedContent = editableContent.trim();
    if (!trimmedContent) {
      return;
    }
    
    console.log('JournalEntryView - Saving and closing entry with content length:', trimmedContent.length);
    await handleSaveAndCloseClick?.();
  };

  // View for a regular journal entry
  if (isEditing) {
    return (
      <div className="p-6">
        <JournalEntryEditor
          title={editableTitle}
          content={editableContent}
          onChange={setEditableContent}
          onTitleChange={setEditableTitle}
          promptText={entry.prompt || undefined}
        />
        <JournalEntrySaveButton 
          onSave={handleSave} 
          isSaving={isSaving}
          onSaveAndClose={handleSaveAndClose}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <JournalEntryMeta entry={entry} title={editableTitle} />
      
      <h1 className="text-2xl font-semibold mt-4 mb-6">
        {editableTitle}
      </h1>
      
      <JournalEntryContent entry={entry} parsedContent={parsedContent} />
      
      {isConversationSummary && (
        <div className="mt-8 mb-6">
          <Link to={`/my-story?conversationId=${entry.conversation_id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <MessageSquare size={16} />
              View Full Conversation
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
