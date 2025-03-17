
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthFormHeader } from '../auth/AuthFormHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <AuthFormHeader />
        </Link>
        
        {isMobile ? (
          <div className="block md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-jess-primary" />
            </Button>
            
            {mobileMenuOpen && (
              <div className="absolute top-20 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border border-jess-subtle w-64">
                <nav className="flex flex-col space-y-3">
                  <span className="text-sm font-medium text-jess-accent bg-black/5 px-2 py-1 rounded text-center">
                    Use code <span className="font-mono font-bold">BETA30</span> for 30 days free!
                  </span>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="ghost" className="w-full text-jess-foreground font-semibold">Login</Button>
                  </Link>
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full font-medium">Get Started</Button>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex space-x-4 items-center">
            <span className="text-sm font-medium text-jess-accent">
              Use code <span className="font-mono font-bold bg-black/5 px-1.5 py-0.5 rounded">BETA30</span> for 30 days free!
            </span>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-jess-foreground font-semibold">Login</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="font-medium">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
