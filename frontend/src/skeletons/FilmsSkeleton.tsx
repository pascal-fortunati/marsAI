import { Skeleton } from "../components/ui/skeleton";

export function FilmsTableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i} className="border-b border-white/8">
          <td className="px-3 py-4">
            <Skeleton className="h-4 w-4 rounded bg-white/12" />
          </td>
          {Array.from({ length: 8 }, (_, col) => (
            <td key={col} className="px-3 py-4">
              <Skeleton
                className={`h-3 rounded bg-white/10 ${
                  col === 0 ? "w-40" : col === 1 ? "w-24" : "w-28"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
