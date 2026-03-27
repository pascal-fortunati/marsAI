import { Skeleton } from "../components/ui/skeleton";

export function UsersSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-white/12" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-32 rounded bg-white/12" />
              <Skeleton className="h-2.5 w-48 rounded bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-7 w-24 rounded-lg bg-white/12" />
        </div>
      ))}
    </div>
  );
}
