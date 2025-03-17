
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pencil, Home, User, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-jess-subtle/30 shadow-sm">
      <div className="flex items-center">
        <Link to="/dashboard" className="group">
          <h1 className="text-2xl font-cormorant font-medium tracking-tight bg-gradient-to-r from-jess-primary to-jess-foreground bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:scale-105">
            JESS
          </h1>
          <div className="h-0.5 w-0 bg-jess-primary rounded-full transition-all duration-300 group-hover:w-full"></div>
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link 
          to="/dashboard"
          className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 hover:scale-105 relative group"
        >
          <Home size={18} className="mr-2" />
          <span className="font-medium">Home</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-jess-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        
        {user && (
          <>
            <Link
              to="/account"
              className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 hover:scale-105 relative group"
            >
              <Pencil size={18} className="mr-2" />
              <span className="font-medium">Edit Profile</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-jess-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <button
              onClick={() => signOut()}
              className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 hover:scale-105"
            >
              <LogOut size={18} className="mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </>
        )}
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-jess-foreground focus:outline-none"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 border-b border-jess-subtle/30 md:hidden animate-fade-in z-30">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/dashboard"
              className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} className="mr-2" />
              <span className="font-medium">Home</span>
            </Link>
            
            {user && (
              <>
                <Link
                  to="/account"
                  className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  <span className="font-medium">Edit Profile</span>
                </Link>
                
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center text-jess-foreground hover:text-jess-primary transition-colors duration-300 py-2"
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
