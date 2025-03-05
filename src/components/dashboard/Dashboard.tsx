
import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { MoodCheck } from './MoodCheck';
import { ChatInterface } from '../chat/ChatInterface';
import { JournalHistory } from '../journal/JournalHistory';
import { BookOpen, MessageSquare, Zap, PenLine } from 'lucide-react';

export const Dashboard = () => {
  const { profile } = useUserData();
  const [activeChat, setActiveChat] = useState<'story' | 'sideQuest' | 'action' | 'journal' | null>(null);

  const handleStartChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    setActiveChat(type);
  };

  const handleBackToDashboard = () => {
    setActiveChat(null);
  };

  if (activeChat) {
    return (
      <div className="h-full">
        <ChatInterface type={activeChat} onBack={handleBackToDashboard} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-serif font-medium mb-2">Welcome, Friend</h2>
        <p className="text-xl font-serif text-jess-primary/80 italic mb-1">
          Rewrite your story, one conversation at a time.
        </p>
        <p className="text-jess-muted">
          What would you like to explore today?
        </p>
      </div>

      <div className="mb-6">
        <MoodCheck />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Core Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => handleStartChat('story')} 
            className="card-base card-hover cursor-pointer sketch-border"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-jess-accent/20 flex items-center justify-center mr-3">
                <BookOpen className="text-jess-primary" size={20} />
              </div>
              <h3 className="font-medium text-lg">My Story</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Share your life stories and gain new perspectives on pivotal moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('sideQuest')} 
            className="card-base card-hover cursor-pointer sketch-border"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-jess-accent/20 flex items-center justify-center mr-3">
                <MessageSquare className="text-jess-primary" size={20} />
              </div>
              <h3 className="font-medium text-lg">Side Quest</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Work through a specific challenge you're facing right now.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('action')} 
            className="card-base card-hover cursor-pointer sketch-border"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-jess-accent/20 flex items-center justify-center mr-3">
                <Zap className="text-jess-primary" size={20} />
              </div>
              <h3 className="font-medium text-lg">Action Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Get a personalized real-world challenge to create breakthrough moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('journal')} 
            className="card-base card-hover cursor-pointer sketch-border"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-jess-accent/20 flex items-center justify-center mr-3">
                <PenLine className="text-jess-primary" size={20} />
              </div>
              <h3 className="font-medium text-lg">Journal Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Receive thought-provoking writing prompts for deeper self-reflection.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="card-base min-h-[100px] flex items-center justify-center sketch-border">
          <p className="text-jess-muted">
            Your recent activity will appear here as you use the app.
          </p>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-jess-subtle/50 rounded-xl text-center border border-jess-subtle">
        <p className="text-jess-muted text-sm leading-relaxed">
          JESS helps you process your stories, reframe limiting beliefs, and take actionable steps toward real change — just like chatting with a wise, warm friend who guides you toward deeper awareness.
        </p>
      </div>
    </div>
  );
};
