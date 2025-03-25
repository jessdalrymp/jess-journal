
import { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/types';
import { parseEntryContent } from '@/utils/contentParser';
import { JournalEntryContent } from './JournalEntryContent';
import { JournalEntryMeta } from './JournalEntryMeta';
import { JournalEntrySaveButton } from './JournalEntrySaveButton';
import { JournalEntryEditor } from './JournalEntryEditor';
import { Button } from '@/components/ui/button';
import { MessageSquare, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface JournalEntryViewProps {
  entry: JournalEntry;
  parsedContent: ReturnType<typeof parseEntryContent>;
  isEditing: boolean;
  editableTitle: string;
  editableContent: string;
  setEditableTitle: (title: string) => void;
  setEditableContent: (content: string) => void;
  handleSaveClick: () => Promise<boolean>;
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
  const navigate = useNavigate();
  
  const handleSaveAndClose = async () => {
    const success = await handleSaveClick();
    if (success) {
      navigate('/dashboard');
    }
  };
  
  // View for a regular journal entry
  if (isEditing) {
    return (
      <div className="p-6">
        <JournalEntryEditor
          title={editableTitle}
          content={editableContent}
          onTitleChange={setEditableTitle}
          onChange={setEditableContent}
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            onClick={handleSaveAndClose}
            disabled={isSaving} 
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save & Close"}
          </Button>
          <JournalEntrySaveButton onClick={handleSaveClick} isSaving={isSaving} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <JournalEntryMeta entry={entry} />
      
      <h1 className="text-2xl font-semibold mt-4 mb-6">
        {editableTitle}
      </h1>
      
      <JournalEntryContent entry={entry} parsedContent={parsedContent} />
      
      <div className="mt-8 mb-6 flex flex-wrap gap-4">
        {isConversationSummary && (
          <Link to={`/my-story?conversationId=${entry.conversation_id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <MessageSquare size={16} />
              View Full Conversation
            </Button>
          </Link>
        )}
        
        <Button 
          onClick={() => navigate('/dashboard')}
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
