
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
                  <Link to="/free-journal-prompts" className="w-full">
                    <Button variant="ghost" className="w-full text-jess-foreground/90 font-medium">
                      Free Journal Prompts
                    </Button>
                  </Link>
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
            <Link to="/free-journal-prompts">
              <Button variant="ghost" className="text-jess-foreground/90 font-medium">
                Free Journal Prompts
              </Button>
            </Link>
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
