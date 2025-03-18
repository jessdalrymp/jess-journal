
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  
  return (
    <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
      <span>{error}</span>
    </div>
  );
};
