
import { Skeleton } from '@/components/ui/skeleton';

export const JournalHistorySkeleton = ({ itemCount = 3 }: { itemCount?: number }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-7 w-28" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 bg-white rounded-lg border border-jess-subtle/20 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex-shrink-0 mr-4">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="ml-auto flex-shrink-0">
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
};
