
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Core actions skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-jess-subtle/50">
        <Skeleton className="h-8 w-48 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="h-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Growth insights skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-jess-subtle/50">
        <Skeleton className="h-7 w-56 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Journal history skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-jess-subtle/50">
        <Skeleton className="h-7 w-56 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Account section skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-jess-subtle/50">
        <Skeleton className="h-7 w-36 mb-4" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
};
