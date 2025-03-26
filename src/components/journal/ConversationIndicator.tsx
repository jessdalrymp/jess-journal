
import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConversationIndicatorProps {
  conversationId: string | null | undefined;
}

export const ConversationIndicator = ({ conversationId }: ConversationIndicatorProps) => {
  if (!conversationId) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <div className="inline-flex items-center text-xs text-blue-600 mt-2 bg-blue-50 px-2 py-0.5 rounded">
            <MessageCircle size={12} className="mr-1" />
            <span>From conversation</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">This journal entry is linked to a conversation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
