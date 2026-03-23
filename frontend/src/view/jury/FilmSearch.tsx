import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

type FilmSearchProps = {
  query: string;
  onSearch: (query: string) => void;
  activeFilter: "all" | "pending" | "voted";
  onFilterChange: (filter: "all" | "pending" | "voted") => void;
  votedFilms: number;
  totalFilms: number;
  progression: number;
  disabled?: boolean;
};

export function FilmSearch({
  query,
  onSearch,
  activeFilter,
  onFilterChange,
  votedFilms,
  totalFilms,
  progression,
  disabled,
}: FilmSearchProps) {
  const { t } = useTranslation();

  // TODO: appeler l'API /api/films?search=...
  return (
    <div className="rounded-[20px] border border-slate-800 bg-slate-900/45 p-4 text-white shadow-lg md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            className="f-mono w-full rounded border border-slate-800 bg-slate-900 py-2 pl-12 pr-3 text-white placeholder:text-slate-400 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t("jury.searchPlaceholder")}
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`f-mono rounded-md px-3 py-2 text-sm transition ${
              activeFilter === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("jury.filterAll")}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("pending")}
            className={`f-mono rounded-md px-3 py-2 text-sm transition ${
              activeFilter === "pending"
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("jury.filterPending")}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("voted")}
            className={`f-mono rounded-md px-3 py-2 text-sm transition ${
              activeFilter === "voted"
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("jury.filterVoted")}
          </button>

          <div className="ml-2 flex min-w-[230px] items-center gap-3 pl-2">
            <span className="f-mono text-sm text-slate-300">
              {t("nav.stats.progress")}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-l-full rounded-r-none bg-violet-400"
                style={{ width: `${progression}%` }}
              />
            </div>
            <span className="f-orb text-lg font-black text-white">
              {votedFilms}/{totalFilms}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
