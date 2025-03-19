
import React, { useState, useRef, useEffect } from 'react';
import { ActionButton } from '../ui/ActionButton';
import { Send, Loader2, BookOpen } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading?: boolean;
  disabled?: boolean;
  type?: 'story' | 'sideQuest' | 'action' | 'journal';
  onJournal?: () => void;
}

export const ChatInput = ({ 
  onSendMessage, 
  loading = false, 
  disabled = false,
  type,
  onJournal
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSend = () => {
    if (!message.trim() || loading || disabled) return;
    onSendMessage(message);
    setMessage('');
  };
  
  // Automatically adjust the height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to calculate correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to match the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);
  
  return (
    <div className="border-t border-jess-subtle p-4">
      <div className="flex items-center">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={loading ? "Jess is thinking..." : "Type your message..."}
          className="flex-1 bg-jess-subtle text-jess-foreground min-h-[40px] max-h-[200px] overflow-y-auto resize-none py-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading || disabled}
          rows={1}
        />
        
        {type === 'journal' && onJournal && (
          <button
            onClick={onJournal}
            className="ml-2 p-2 rounded-full bg-jess-subtle hover:bg-jess-muted transition-colors"
            title="Open journal prompts"
          >
            <BookOpen size={18} />
          </button>
        )}
        
        {loading ? (
          <div className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center bg-jess-subtle">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <ActionButton
            type="primary"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="ml-2 w-10 h-10 p-0 rounded-full flex items-center justify-center"
            icon={<Send size={18} />}
          >
            <span className="sr-only">Send</span>
          </ActionButton>
        )}
      </div>
    </div>
  );
};
