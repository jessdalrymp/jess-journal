
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { ChatInterface } from '../chat/ChatInterface';
import { Book, MessageSquare, Lightbulb, PenLine, Clock, History, User, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { profile, journalEntries } = useUserData();
  const [activeChat, setActiveChat] = useState<'story' | 'sideQuest' | 'action' | 'journal' | null>(null);

  const handleStartChat = (type: 'story' | 'sideQuest' | 'action' | 'journal') => {
    setActiveChat(type);
  };

  const handleBackToDashboard = () => {
    setActiveChat(null);
  };

  // Get recent journal entries
  const recentEntries = [...journalEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (activeChat) {
    return (
      <div className="h-full">
        <ChatInterface type={activeChat} onBack={handleBackToDashboard} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Actions Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-5">Core Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => handleStartChat('story')}
              className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="text-jess-primary mb-3">
                <Book size={24} />
              </div>
              <h3 className="text-center">My Story</h3>
            </div>
            
            <div 
              onClick={() => handleStartChat('sideQuest')}
              className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="text-jess-primary mb-3">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-center">Side Quest</h3>
            </div>
            
            <div 
              onClick={() => handleStartChat('action')}
              className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="text-jess-primary mb-3">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-center">Action Challenge</h3>
            </div>
            
            <div 
              onClick={() => handleStartChat('journal')}
              className="bg-jess-subtle rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all"
            >
              <div className="text-jess-primary mb-3">
                <PenLine size={24} />
              </div>
              <h3 className="text-center">Journal Challenge</h3>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-medium">Recent Activity</h2>
            <button className="text-jess-primary text-sm">View All</button>
          </div>
          
          <div className="flex flex-col items-center justify-center h-[220px]">
            {recentEntries.length > 0 ? (
              <div className="w-full space-y-3">
                {recentEntries.map(entry => (
                  <div key={entry.id} className="border border-jess-subtle p-3 rounded-lg">
                    <h3 className="font-medium">{entry.title}</h3>
                    <div className="text-sm text-jess-muted">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-jess-muted mb-2">
                  <Clock size={48} className="mx-auto opacity-50" />
                </div>
                <p className="text-jess-muted mb-1">Your journal entries will appear here</p>
                <p className="text-sm text-jess-muted">Start a conversation to begin</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Journal History Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-medium">Journal History</h2>
            <button className="text-jess-primary text-sm">View All</button>
          </div>
          
          <div 
            className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
            onClick={() => {/* Open journal history */}}
          >
            <div className="flex items-center">
              <History size={20} className="text-jess-primary mr-3" />
              <span>View your journal history</span>
            </div>
            <ArrowRight size={18} />
          </div>
        </div>
        
        {/* Account Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-5">Account</h2>
          
          <div 
            className="bg-jess-subtle rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
            onClick={() => {/* Open account settings */}}
          >
            <div className="flex items-center">
              <User size={20} className="text-jess-primary mr-3" />
              <span>Manage your account</span>
            </div>
            <ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
