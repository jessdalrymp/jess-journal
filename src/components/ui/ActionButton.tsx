
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
    'transition-all duration-300 rounded-xl flex items-center justify-center font-medium relative overflow-visible px-6 py-3',
    {
      'bg-jess-primary text-white hover:bg-jess-primary/90': type === 'primary',
      'bg-[#FFE8D6] text-jess-foreground hover:bg-[#FFE8D6]/80': type === 'secondary',
      'bg-transparent text-jess-foreground hover:bg-jess-subtle/50': type === 'ghost',
      'opacity-50 cursor-not-allowed': disabled,
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
