
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ActionButton = ({
  children,
  onClick,
  type = 'primary',
  icon,
  className,
  disabled = false,
}: ActionButtonProps) => {
  const baseClasses = cn(
    'transition-all duration-300 rounded-full flex items-center justify-center font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jess-primary/40',
    {
      'bg-jess-secondary text-jess-foreground hover:bg-jess-secondary/90': type === 'primary',
      'bg-jess-subtle text-jess-foreground hover:bg-jess-subtle/80': type === 'secondary',
      'bg-transparent text-jess-foreground hover:bg-jess-subtle/50': type === 'ghost',
      'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100': disabled,
    },
    className
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
