
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-10 bg-white border-b border-jess-subtle/30">
      <div className="flex items-center">
        <h1 className="text-2xl font-cormorant font-medium tracking-tight text-jess-foreground">
          JESS
        </h1>
      </div>
      
      {user && (
        <div className="flex items-center space-x-6">
          <button
            className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
            onClick={() => {}}
          >
            <User size={20} className="mr-2" />
            <span className="font-medium">Profile</span>
          </button>
          
          <button
            onClick={() => signOut()}
            className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
