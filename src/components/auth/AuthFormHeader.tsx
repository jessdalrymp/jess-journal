
import React from 'react';

interface AuthFormHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthFormHeader = ({ title, subtitle }: AuthFormHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-medium text-jess-foreground">{title}</h1>
      {subtitle && <p className="mt-2 text-jess-muted text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
};
