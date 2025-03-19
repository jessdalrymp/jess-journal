
import React from 'react';
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

  // Handle conversation selection with better touch support
  const handleSelectConversation = (conversationId: string) => {
    console.log(`Mobile: Selecting conversation: ${conversationId}`);
    onSelectConversation(conversationId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full p-4 flex flex-col">
      <h3 className="text-lg font-medium mb-3">Prior Conversations</h3>
      
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          <p className="text-gray-500 mb-2">No prior conversations yet</p>
          <p className="text-sm text-gray-400">Your saved conversations will appear here</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {conversations.map(conversation => (
              <button 
                key={conversation.id}
                className={`w-full text-left p-3 rounded-md cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors border ${
                  currentConversationId === conversation.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
                aria-label={`Select conversation: ${conversation.title || 'My Story'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium text-sm line-clamp-1">
                      {conversation.title || 'My Story'}
                    </h4>
                  </div>
                  {currentConversationId === conversation.id && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">Current</span>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                
                {conversation.summary && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 bg-gray-50 p-2 rounded italic">
                    {conversation.summary}
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
