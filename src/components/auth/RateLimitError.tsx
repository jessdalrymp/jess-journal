
import { Clock } from 'lucide-react';
import { getSuggestedWaitTime } from '../../utils/email/rateLimitDetection';

interface RateLimitErrorProps {
  message: string;
  attempts?: number;
}

export const RateLimitError = ({ message, attempts = 1 }: RateLimitErrorProps) => {
  const waitTime = getSuggestedWaitTime(attempts);
  
  return (
    <div className="flex items-start gap-2 p-4 rounded-md bg-amber-50 text-amber-700 text-sm">
      <Clock className="h-5 w-5 flex-shrink-0 text-amber-500" />
      <div>
        <p className="font-medium">Rate limit reached</p>
        <p>{message}</p>
        <p className="mt-1 text-xs">Please wait approximately {waitTime} {waitTime === 1 ? 'minute' : 'minutes'} before trying again.</p>
      </div>
    </div>
  );
};
