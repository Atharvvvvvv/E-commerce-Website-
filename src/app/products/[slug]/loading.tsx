export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back button skeleton */}
      <div className="h-4 w-28 bg-stone-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Imagery skeleton */}
        <div className="aspect-square bg-stone-100 dark:bg-zinc-800/80 rounded-lg animate-pulse" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-6 w-32 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="h-24 w-full bg-stone-100 dark:bg-zinc-800/60 rounded animate-pulse" />

          <div className="h-12 w-48 bg-stone-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
