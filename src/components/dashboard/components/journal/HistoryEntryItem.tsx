import React from 'react';
import { JournalEntry } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Book, MessageSquare } from 'lucide-react';

interface HistoryEntryItemProps {
  entry: JournalEntry;
  highlight?: boolean;
}

export const HistoryEntryItem = ({ entry, highlight = false }: HistoryEntryItemProps) => {
  const getEntryTitle = () => {
    if (entry.title) return entry.title;
    
    // If no title, use the first part of content or prompt
    const contentPreview = entry.content?.substring(0, 50).trim() || '';
    if (contentPreview) return contentPreview;
    
    return entry.prompt?.substring(0, 50).trim() || 'Untitled Entry';
  };

  const getBadgeType = () => {
    switch (entry.type) {
      case 'story':
        return 'Story';
      case 'sideQuest':
        return 'Side Quest';
      case 'action':
        return 'Action';
      case 'summary':
        return 'Summary';
      default:
        return 'Journal';
    }
  };

  const getEntryUrl = () => {
    if (entry.type === 'story' || entry.type === 'sideQuest' || entry.type === 'action') {
      if (entry.conversationId) {
        return `/${entry.type.toLowerCase()}?conversationId=${entry.conversationId}`;
      }
    }
    
    return `/journal-entry/${entry.id}`;
  };

  const renderConversationIcon = () => {
    if (entry.conversationId) {
      return (
        <div className="text-gray-500 mr-1">
          <MessageSquare className="h-4 w-4" />
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
    >
      <div className="flex items-center">
        {renderConversationIcon()}
        <div>
          <h3 className="text-sm font-medium">{getEntryTitle()}</h3>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(entry.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <Badge variant="secondary">{getBadgeType()}</Badge>
    </Card>
  );
};
