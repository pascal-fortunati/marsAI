import { Skeleton } from "../components/ui/skeleton";

export function EmailSkeleton() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="h-[620px] rounded-2xl border border-white/8 bg-white/[0.03] p-4 lg:w-[320px]">
        <Skeleton className="mb-4 h-4 w-36 rounded bg-white/14" />
        <div className="space-y-2">
          {Array.from({ length: 9 }, (_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
      <div className="flex-1 min-w-0 grid gap-6">
        <div className="h-[360px] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <Skeleton className="mb-3 h-4 w-44 rounded bg-white/14" />
          <Skeleton className="mb-3 h-12 rounded-xl bg-white/10" />
          <Skeleton className="mb-3 h-40 rounded-xl bg-white/9" />
          <Skeleton className="h-9 w-40 rounded-xl bg-[#7d71fb]/22" />
        </div>
        <div className="h-[340px] rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <Skeleton className="mb-3 h-4 w-52 rounded bg-white/14" />
          <Skeleton className="h-[276px] rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
