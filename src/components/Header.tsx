
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      <div className="flex items-center space-x-6">
        <Link 
          to="/"
          className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
        >
          <Home size={20} className="mr-2" />
          <span className="font-medium">Home</span>
        </Link>
        
        {user && (
          <>
            <Link
              to="/account"
              className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
            >
              <User size={20} className="mr-2" />
              <span className="font-medium">Profile</span>
            </Link>
            
            <button
              onClick={() => signOut()}
              className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
