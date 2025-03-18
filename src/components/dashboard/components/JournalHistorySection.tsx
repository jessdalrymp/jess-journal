
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import { History, ArrowRight, Calendar, Clock, PenLine, BookOpen, MessageSquare, Zap } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { parseContentWithJsonCodeBlock } from '@/services/journal';

// Helper function to get the appropriate icon for each journal type
const getEntryIcon = (type: string) => {
  switch (type) {
    case 'story':
      return <BookOpen size={16} className="text-blue-500" />;
    case 'sideQuest':
      return <MessageSquare size={16} className="text-purple-500" />;
    case 'action':
      return <Zap size={16} className="text-amber-500" />;
    case 'morning':
      return <Clock size={16} className="text-amber-500" />;
    case 'evening':
      return <Clock size={16} className="text-indigo-500" />;
    case 'journal':
    default:
      return <PenLine size={16} className="text-green-500" />;
  }
};

// Format the date in a readable way
const formatDate = (date: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Format time from date object
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// Attempt to get journal entry type from content
const getEntryType = (entry: JournalEntry): string => {
  try {
    // Check if the content contains JSON
    if (entry.content.includes('"type":')) {
      const match = entry.content.match(/"type"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Default to the entry's type field or "journal"
    return entry.type || 'journal';
  } catch (e) {
    return entry.type || 'journal';
  }
};

export const JournalHistorySection = () => {
  const { journalEntries, loading } = useUserData();
  const isMobile = useIsMobile();
  
  // Filter and sort recent entries
  const recentEntries = journalEntries 
    ? [...journalEntries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    : [];
  
  // Function to parse the entry content for potential JSON with a title or summary
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
    
    return entry.title;
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-jess-subtle/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Subtle gradient background that moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-jess-subtle/10 via-white to-jess-secondary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-medium bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent">Journal History</h2>
          <Link 
            to="/journal-history" 
            className="text-jess-primary text-sm hover:text-jess-foreground transition-colors duration-300 flex items-center gap-1 group"
          >
            View All
            <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="space-y-3">
          <Link to="/journal-history">
            <div className="bg-gradient-to-r from-jess-subtle/80 to-white rounded-lg p-4 flex items-center justify-between cursor-pointer shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gradient-to-r hover:from-jess-secondary/60 hover:to-white border border-jess-subtle/30 hover:border-jess-secondary/50 group">
              <div className="flex items-center">
                <div className="bg-jess-primary/10 p-2 rounded-full">
                  <History size={20} className="text-jess-primary" />
                </div>
                <span className="ml-3 font-medium">View your journal history</span>
              </div>
              <ArrowRight size={18} className="transform transition-transform duration-300 group-hover:translate-x-1 text-jess-primary/80" />
            </div>
          </Link>
          
          {/* Recent Entries - Show actual entries or placeholder */}
          <div className="mt-5 space-y-3 pl-2">
            {loading ? (
              // Loading state
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative border-l-2 border-jess-subtle pl-4 pb-5">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-subtle animate-pulse"></div>
                  <div className="flex items-center text-xs text-jess-muted mb-1 space-x-1">
                    <div className="h-3 w-16 bg-jess-subtle/50 rounded animate-pulse"></div>
                    <div className="h-3 w-12 bg-jess-subtle/50 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-36 bg-jess-subtle/50 rounded animate-pulse"></div>
                </div>
              ))
            ) : recentEntries.length > 0 ? (
              // Show actual entries
              recentEntries.map((entry) => {
                const entryType = getEntryType(entry);
                return (
                  <Link 
                    key={entry.id} 
                    to={`/journal-entry/${entry.id}`}
                    className="relative border-l-2 border-jess-subtle pl-4 pb-5 block group"
                  >
                    <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-secondary group-hover:bg-jess-primary transition-colors"></div>
                    <div className="flex items-center text-xs text-jess-muted mb-1">
                      <Calendar size={12} className="mr-1" />
                      <span>{formatDate(new Date(entry.createdAt))}</span>
                      <Clock size={12} className="ml-2 mr-1" />
                      <span>{formatTime(new Date(entry.createdAt))}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">{getEntryIcon(entryType)}</span>
                      <p className="text-sm font-medium text-jess-foreground group-hover:text-jess-primary transition-colors">
                        {getEntryTitle(entry)}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              // Show empty state with suggestion
              <div className="text-center py-4">
                <p className="text-sm text-jess-muted mb-2">No journal entries yet</p>
                <Link 
                  to="/journal-challenge" 
                  className="inline-flex items-center text-xs text-jess-primary hover:text-jess-foreground"
                >
                  Start journaling
                  <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
