export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header Skeleton */}
      <div className="h-10 w-48 bg-stone-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-[#1c1c20] p-3 space-y-3"
          >
            <div className="aspect-square w-full bg-stone-100 dark:bg-zinc-800/80 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
