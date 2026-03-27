import { Skeleton } from "../components/ui/skeleton";

export function YoutubeSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="h-[380px] rounded-2xl border border-white/8 bg-white/[0.03] p-4 lg:col-span-7">
          <Skeleton className="mb-3 h-4 w-44 rounded bg-white/14" />
          <Skeleton className="mb-3 h-12 rounded-xl bg-white/10" />
          <Skeleton className="mb-3 h-12 rounded-xl bg-white/10" />
          <Skeleton className="h-[240px] rounded-xl bg-white/9" />
        </div>
        <div className="h-[380px] rounded-2xl border border-white/8 bg-white/[0.03] p-4 lg:col-span-5">
          <Skeleton className="mb-3 h-4 w-36 rounded bg-white/14" />
          <div className="space-y-2">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-9 rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </div>
      <div className="h-[220px] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <Skeleton className="mb-3 h-4 w-52 rounded bg-white/14" />
        <Skeleton className="h-[164px] rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
