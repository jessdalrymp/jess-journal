
import React, { useEffect } from 'react';
import { Conversation } from '@/services/conversation/types';
import { Button } from "@/components/ui/button";
import { Loader2, Clock, ChevronRight, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';

interface MyStoryPriorConversationsProps {
  conversations: Conversation[];
  loading: boolean;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId: string | null;
}

export const MyStoryPriorConversations: React.FC<MyStoryPriorConversationsProps> = ({
  conversations,
  loading,
  onSelectConversation,
  currentConversationId
}) => {
  // Log conversations for debugging
  useEffect(() => {
    console.log(`MyStoryPriorConversations - Rendering ${conversations.length} story conversations`);
    if (conversations.length > 0) {
      console.log("MyStoryPriorConversations - First 3 conversations:", 
        conversations.slice(0, 3).map(c => ({
          id: c.id,
          title: c.title,
          date: c.updatedAt,
          messageCount: c.messages?.length || 0
        }))
      );
    }
  }, [conversations]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-full p-4 flex flex-col">
        <h3 className="text-lg font-medium mb-3">Prior Conversations</h3>
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // Filter out the current conversation from the list to prevent duplicates
  const filteredConversations = conversations.filter(
    conversation => conversation.id !== currentConversationId
  );

  // Handle conversation selection with better touch support
  const handleSelectConversation = (conversationId: string) => {
    console.log(`MyStoryPriorConversations - Selecting conversation: ${conversationId}`);
    onSelectConversation(conversationId);
  };

  // Format time with date-fns v3 compatibility
  const formatTimeAgo = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'some time ago';
    }
  };

  // Function to truncate summary for more compact display
  const truncateSummary = (summary: string | null | undefined) => {
    if (!summary) return "";
    return summary.length > 80 ? summary.substring(0, 80) + "..." : summary;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full p-4 flex flex-col">
      <h3 className="text-lg font-medium mb-3">Prior Conversations</h3>
      
      {filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          <p className="text-gray-500 mb-2">No prior conversations yet</p>
          <p className="text-sm text-gray-400">Your saved conversations will appear here</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredConversations.map(conversation => (
              <button 
                key={conversation.id}
                className="w-full text-left p-3 rounded-md cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
                onClick={() => handleSelectConversation(conversation.id)}
                aria-label={`Select conversation: ${conversation.title || 'My Story'}`}
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium text-sm line-clamp-1">
                    {conversation.title || 'My Story'}
                  </h4>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatTimeAgo(conversation.updatedAt)}</span>
                </div>
                
                {conversation.summary && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 bg-gray-50 p-2 rounded italic">
                    {truncateSummary(conversation.summary)}
                  </p>
                )}
                
                <div className="mt-2 text-xs text-blue-500 hover:text-blue-700 flex items-center">
                  <span>Continue story</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
