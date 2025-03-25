
import { MessageSquare, FileText } from "lucide-react";

interface EntryTagsProps {
  isConversation: boolean;
  isSummary: boolean;
}

export const EntryTags = ({ isConversation, isSummary }: EntryTagsProps) => {
  return (
    <div className="flex gap-1">
      {isConversation && (
        <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          <MessageSquare size={12} className="mr-1" />
          Conversation
        </span>
      )}
      {isSummary && (
        <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
          <FileText size={12} className="mr-1" />
          Summary
        </span>
      )}
    </div>
  );
};
