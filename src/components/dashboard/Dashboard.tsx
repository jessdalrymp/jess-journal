import { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { MoodCheck } from './MoodCheck';
import { ChatInterface } from '../chat/ChatInterface';
import { JournalHistory } from '../journal/JournalHistory';
import { ActionButton } from '../ui/ActionButton';
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 sketch-bg">
      <div className="mb-10 text-center">
        <h1 className="text-4xl mb-2 text-jess-secondary">I made this program because I had to do all this for myself.</h1>
        <p className="text-jess-muted max-w-2xl mx-auto">
          I rewrote my story, one conversation at a time.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-medium">Welcome, Friend</h2>
          <JournalHistory />
        </div>
        <p className="text-jess-muted">
          What would you like to explore today?
        </p>
      </div>

      <div className="mb-8">
        <MoodCheck />
      </div>
      
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-6">Core Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => handleStartChat('story')} 
            className="card-base card-hover cursor-pointer border-2 border-black/10 hover:border-jess-primary/30"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-jess-primary/10 flex items-center justify-center mr-3">
                <BookOpen className="text-jess-primary" size={22} />
              </div>
              <h3 className="font-serif font-medium text-lg">My Story</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Share your life stories and gain new perspectives on pivotal moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('sideQuest')} 
            className="card-base card-hover cursor-pointer border-2 border-black/10 hover:border-jess-primary/30"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-jess-primary/10 flex items-center justify-center mr-3">
                <MessageSquare className="text-jess-primary" size={22} />
              </div>
              <h3 className="font-serif font-medium text-lg">Side Quest</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Work through a specific challenge you're facing right now.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('action')} 
            className="card-base card-hover cursor-pointer border-2 border-black/10 hover:border-jess-primary/30"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-jess-primary/10 flex items-center justify-center mr-3">
                <Zap className="text-jess-primary" size={22} />
              </div>
              <h3 className="font-serif font-medium text-lg">Action Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Get a personalized real-world challenge to create breakthrough moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('journal')} 
            className="card-base card-hover cursor-pointer border-2 border-black/10 hover:border-jess-primary/30"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-jess-primary/10 flex items-center justify-center mr-3">
                <PenLine className="text-jess-primary" size={22} />
              </div>
              <h3 className="font-serif font-medium text-lg">Journal Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Receive thought-provoking writing prompts for deeper self-reflection.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="card-base min-h-[100px] flex items-center justify-center border-2 border-black/10">
          <p className="text-jess-muted">
            Your recent activity will appear here as you use the app.
          </p>
        </div>
      </div>
    </div>
  );
};
