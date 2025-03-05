
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-10 bg-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-serif tracking-tight text-jess-primary">
          JESS
        </h1>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-jess-foreground">
            <User size={20} />
            <span className="hidden sm:inline">Profile</span>
          </button>
          
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-jess-foreground"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
