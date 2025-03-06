
import React from 'react';
import { Link } from 'react-router-dom';

interface LegalLinksProps {
  className?: string;
  linkClassName?: string;
}

export const LegalLinks = ({ className = "", linkClassName = "" }: LegalLinksProps) => {
  return (
    <div className={`text-center text-sm ${className}`}>
      <Link 
        to="/legal?tab=terms" 
        className={`text-jess-primary hover:underline ${linkClassName}`}
      >
        Terms of Service
      </Link>
      <span className="mx-2 text-jess-muted">&bull;</span>
      <Link 
        to="/legal?tab=privacy" 
        className={`text-jess-primary hover:underline ${linkClassName}`}
      >
        Privacy Policy
      </Link>
    </div>
  );
};
