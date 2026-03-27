import { Skeleton } from "../components/ui/skeleton";

export function SiteSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
      <div className="lg:col-span-7">
        <div className="h-[760px] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-40 rounded bg-white/14" />
            <Skeleton className="h-9 w-28 rounded-xl bg-[#7d71fb]/20" />
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <Skeleton className="h-9 rounded-lg bg-white/10" />
            <Skeleton className="h-9 rounded-lg bg-white/10" />
            <Skeleton className="h-9 rounded-lg bg-white/10" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-white/9" />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="h-[760px] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <Skeleton className="mb-4 h-4 w-36 rounded bg-white/14" />
          <Skeleton className="mb-3 h-52 rounded-xl bg-white/10" />
          <Skeleton className="mb-3 h-28 rounded-xl bg-white/10" />
          <Skeleton className="h-[330px] rounded-xl bg-white/9" />
        </div>
      </div>
    </div>
  );
}
