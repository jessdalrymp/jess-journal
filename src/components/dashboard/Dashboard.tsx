
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-medium">Welcome, {profile?.name || 'Friend'}</h2>
          <JournalHistory />
        </div>
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
            className="card-base card-hover cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <BookOpen className="text-blue-500" size={20} />
              </div>
              <h3 className="font-medium text-lg">My Story</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Share your life stories and gain new perspectives on pivotal moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('sideQuest')} 
            className="card-base card-hover cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <MessageSquare className="text-purple-500" size={20} />
              </div>
              <h3 className="font-medium text-lg">Side Quest</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Work through a specific challenge you're facing right now.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('action')} 
            className="card-base card-hover cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Zap className="text-amber-500" size={20} />
              </div>
              <h3 className="font-medium text-lg">Action Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Get a personalized real-world challenge to create breakthrough moments.
            </p>
          </div>
          
          <div 
            onClick={() => handleStartChat('journal')} 
            className="card-base card-hover cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <PenLine className="text-green-500" size={20} />
              </div>
              <h3 className="font-medium text-lg">Journal Challenge</h3>
            </div>
            <p className="text-jess-muted text-sm">
              Receive thought-provoking writing prompts for deeper self-reflection.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="card-base min-h-[100px] flex items-center justify-center">
          <p className="text-jess-muted">
            Your recent activity will appear here as you use the app.
          </p>
        </div>
      </div>
    </div>
  );
};
