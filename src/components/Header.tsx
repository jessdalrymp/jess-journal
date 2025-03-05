
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between glassmorphism sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium tracking-tight text-jess-primary">
          JESS
        </h1>
        <span className="text-jess-muted ml-2 text-sm hidden sm:inline-block">
          Your AI Storytelling Coach
        </span>
      </div>
      
      {user && (
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-jess-primary flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {user.name || user.email.split('@')[0]}
            </span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 animate-fade-in">
              <div className="px-4 py-2 text-sm text-jess-muted border-b border-jess-subtle">
                Signed in as<br />
                <span className="font-medium text-jess-foreground">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-2 text-sm text-jess-foreground hover:bg-jess-subtle transition-colors"
              >
                <span className="flex items-center">
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
