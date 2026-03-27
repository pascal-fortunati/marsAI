import { Skeleton } from "../components/ui/skeleton";

export function PalmaresSkeleton() {
  return (
    <div className="mt-8 space-y-10">
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-12 w-44 rounded-xl bg-white/8" />
        <Skeleton className="h-12 w-44 rounded-xl bg-white/8" />
      </div>

      <div className="space-y-5">
        <Skeleton className="h-px w-full rounded-none bg-white/15" />
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <Skeleton className="h-[200px] rounded-2xl bg-white/8" />
          <Skeleton className="h-[220px] rounded-2xl bg-white/10" />
          <Skeleton className="h-[200px] rounded-2xl bg-white/8" />
        </div>
      </div>

      <div className="space-y-5">
        <Skeleton className="h-px w-full rounded-none bg-white/15" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[92px] rounded-xl bg-white/8" />
          ))}
        </div>
      </div>
    </div>
  );
}
