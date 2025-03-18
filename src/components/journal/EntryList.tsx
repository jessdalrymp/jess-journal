
import { JournalEntry } from "../../lib/types";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { parseContentWithJsonCodeBlock } from "@/services/journal";

interface EntryListProps {
  entries: JournalEntry[];
  onEditClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onDeleteClick: (e: React.MouseEvent, entry: JournalEntry) => void;
  onEntryClick: (entry: JournalEntry) => void;
  isLoading: boolean;
}

export const EntryList = ({
  entries,
  onEditClick,
  onDeleteClick,
  onEntryClick,
  isLoading
}: EntryListProps) => {
  const getEntryTitle = (entry: JournalEntry) => {
    try {
      // Parse the content to get the user's answer instead of the question
      const parsedContent = parseContentWithJsonCodeBlock(entry.content);
      
      if (parsedContent) {
        // If we have a summary field (user's answer), use that for the display
        if (parsedContent.summary) {
          // Use the first line or first 50 characters of the summary
          let summaryText = parsedContent.summary.split('\n')[0];
          
          // Replace third-person pronouns with second-person
          summaryText = summaryText
            .replace(/\bthe user\b/gi, "you")
            .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
            .replace(/\btheir\b/gi, "your")
            .replace(/\bthem\b/gi, "you")
            .replace(/\bthemselves\b/gi, "yourself");
          
          return summaryText.length > 50 
            ? summaryText.substring(0, 50) + '...' 
            : summaryText;
        }
        
        // Fallback to title if present
        if (parsedContent.title) {
          // Also personalize the title if possible
          let title = parsedContent.title
            .replace(/\bthe user\b/gi, "you")
            .replace(/\bthey (are|were|have|had|will|would|can|could|should|might|must)\b/gi, "you $1")
            .replace(/\btheir\b/gi, "your")
            .replace(/\bthem\b/gi, "you")
            .replace(/\bthemselves\b/gi, "yourself");
            
          return title;
        }
      }
    } catch (e) {
      // Not valid JSON or doesn't have the expected fields
    }
    
    // Fallback to the original title
    return entry.title;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-t-jess-primary border-r-jess-primary border-b-jess-subtle border-l-jess-subtle rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-jess-muted">Loading journal entries...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-jess-muted mb-2">No journal entries yet</p>
        <p className="text-sm text-jess-muted">Start a conversation to create entries</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="border border-jess-subtle p-4 rounded-lg hover:border-jess-primary transition-colors cursor-pointer"
          onClick={() => onEntryClick(entry)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">{getEntryTitle(entry)}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jess-muted">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="text-xs px-2 py-1 bg-jess-subtle rounded-full">
                  {entry.type}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onEditClick(e, entry)}
                className="h-8 w-8"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onDeleteClick(e, entry)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
