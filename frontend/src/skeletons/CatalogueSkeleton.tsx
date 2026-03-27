import { Skeleton } from "../components/ui/skeleton";

function FilmPerforations({ side }: { side: "left" | "right" }) {
  const sideClass = side === "left" ? "left-0" : "right-0";
  const railEdgeClass = side === "left" ? "border-r" : "border-l";
  return (
    <div
      className={`absolute ${sideClass} top-0 z-10 flex h-full w-4 ${railEdgeClass} flex-col items-center justify-evenly py-2`}
      style={{
        background: "var(--film-perf-bg-skeleton)",
        borderColor: "var(--film-perf-rail-border-skeleton)",
      }}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-[2px]"
          style={{ backgroundColor: "var(--film-perf-hole-skeleton)" }}
        />
      ))}
    </div>
  );
}

function FilmCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/7 bg-white/[0.02]"
      style={{
        animation: `fadeUp 0.4s ease-out ${index * 0.03}s both`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div
        className="relative aspect-video overflow-hidden"
        style={{ background: "var(--catalogue-skeleton-video-bg)" }}
      >
        <FilmPerforations side="left" />
        <FilmPerforations side="right" />
        <div className="absolute inset-y-0 left-4 right-4 overflow-hidden">
          <Skeleton
            className="h-full w-full rounded-none before:via-white/18"
            style={{ backgroundColor: "var(--catalogue-skeleton-video-surface)" }}
          />
          <Skeleton
            className="absolute bottom-2 right-2 h-4 w-9 rounded"
            style={{ backgroundColor: "var(--catalogue-skeleton-video-chip)" }}
          />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Skeleton className="h-4 w-6 rounded bg-white/15" />
          <Skeleton className="h-2 w-16 rounded bg-white/12" />
          <Skeleton className="h-1 w-1 rounded-full bg-white/15" />
          <Skeleton className="h-2 w-8 rounded bg-white/12" />
          <Skeleton className="h-1 w-1 rounded-full bg-white/15" />
          <Skeleton className="h-2 w-14 rounded bg-white/12" />
        </div>
        <Skeleton className="h-4 w-4/5 rounded bg-white/14" />
        <Skeleton className="mt-1 h-4 w-3/5 rounded bg-white/14" />
        <Skeleton className="mt-3 h-2.5 w-full rounded bg-white/10" />
        <Skeleton className="mt-1.5 h-2.5 w-5/6 rounded bg-white/10" />
        <div className="mt-auto flex min-h-[1.4rem] flex-wrap gap-1 pt-2">
          <Skeleton className="h-4 w-14 rounded bg-[#7d71fb]/18" />
          <Skeleton className="h-4 w-16 rounded bg-[#7d71fb]/18" />
          <Skeleton className="h-4 w-12 rounded bg-[#7d71fb]/18" />
        </div>
        <Skeleton className="absolute bottom-3 right-3 h-4 w-20 rounded bg-white/12" />
      </div>
    </div>
  );
}

export function CatalogueSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <FilmCardSkeleton key={`catalogue-sk-${i}`} index={i} />
      ))}
    </>
  );
}
