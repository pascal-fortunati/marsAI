import { Skeleton } from "../components/ui/skeleton";

export function JurySkeleton() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/8 bg-[hsl(var(--card))] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Skeleton className="h-10 flex-1 rounded-xl bg-white/10" />
              <div className="grid w-full grid-cols-3 gap-2 md:w-[280px]">
                <Skeleton className="h-9 rounded-lg bg-white/10" />
                <Skeleton className="h-9 rounded-lg bg-white/10" />
                <Skeleton className="h-9 rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
          <div className="lg:w-80 w-full flex items-center gap-3">
            <Skeleton className="h-3 w-20 rounded bg-white/12" />
            <Skeleton className="h-2 flex-1 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-14 rounded bg-white/12" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-white/8 bg-[hsl(var(--card))] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8">
            <Skeleton className="h-4 w-36 rounded bg-white/12" />
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 9 }, (_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg bg-white/10" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-black">
            <Skeleton className="h-5 w-full rounded-none bg-white/10" />
            <Skeleton className="aspect-video w-full rounded-none bg-white/8" />
          </div>

          <div className="rounded-xl border border-white/8 bg-[hsl(var(--card))] p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-2/3 rounded bg-white/12" />
                <Skeleton className="h-4 w-40 rounded bg-white/10" />
              </div>
              <Skeleton className="h-7 w-24 rounded-lg bg-white/10" />
            </div>
            <Skeleton className="h-4 w-full rounded bg-white/10" />
            <Skeleton className="h-4 w-11/12 rounded bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded bg-white/10" />
              <Skeleton className="h-6 w-24 rounded bg-white/10" />
              <Skeleton className="h-6 w-16 rounded bg-white/10" />
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-[hsl(var(--card))] p-6 space-y-4">
            <Skeleton className="h-3 w-24 rounded bg-white/12" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 rounded-xl bg-white/10" />
              <Skeleton className="h-20 rounded-xl bg-white/10" />
              <Skeleton className="h-20 rounded-xl bg-white/10" />
            </div>
            <Skeleton className="h-px w-full rounded bg-white/8" />
            <Skeleton className="h-3 w-32 rounded bg-white/12" />
            <Skeleton className="h-24 w-full rounded-xl bg-white/10" />
            <div className="flex justify-end gap-3">
              <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
              <Skeleton className="h-10 w-36 rounded-xl bg-[#7d71fb]/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
