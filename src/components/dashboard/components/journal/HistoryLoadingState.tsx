
export const HistoryLoadingState = () => {
  return (
    <>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="relative border-l-2 border-jess-subtle pl-4 pb-5">
          <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-jess-subtle animate-pulse"></div>
          <div className="flex items-center text-xs text-jess-muted mb-1 space-x-1">
            <div className="h-3 w-16 bg-jess-subtle/50 rounded animate-pulse"></div>
            <div className="h-3 w-12 bg-jess-subtle/50 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-36 bg-jess-subtle/50 rounded animate-pulse"></div>
        </div>
      ))}
    </>
  );
};
