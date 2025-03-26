import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const isConversationSummary = !!entry.conversation_id;
  
  const handleSave = async (): Promise<void> => {
    await handleSaveClick();
    return;
  };

  const handleSaveAndClose = async (): Promise<void> => {
    if (handleSaveAndCloseClick) {
      await handleSaveAndCloseClick();
    } else {
      // If no specific handler is provided, save then navigate
      const success = await handleSaveClick();
      if (success !== false) {
        navigate('/');
      }
    }
    return;
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
