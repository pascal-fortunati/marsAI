import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

type FilmSearchProps = {
  query: string;
  onSearch: (query: string) => void;
  activeFilter: "all" | "voted" | "review" | "refused";
  onFilterChange: (filter: "all" | "voted" | "review" | "refused") => void;
  decidedFilms: number;
  totalFilms: number;
  progression: number;
  disabled?: boolean;
};

export function FilmSearch({
  query,
  onSearch,
  activeFilter,
  onFilterChange,
  decidedFilms,
  totalFilms,
  progression,
  disabled,
}: FilmSearchProps) {
  const { t } = useTranslation();
  const activeFilterClass =
    "bg-primary/20 text-primary border border-primary/40";
  const inactiveFilterClass =
    "text-muted-foreground hover:text-foreground border border-transparent hover:border-border hover:bg-secondary/30";

  // TODO: appeler l'API /api/films?search=...
  return (
    <div className="panel rounded-[20px] p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="jury-film-search" className="sr-only">
            {t("jury.searchPlaceholder")}
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="jury-film-search"
            className="f-mono w-full rounded border border-border bg-input py-2 pl-12 pr-3 text-foreground placeholder:text-muted-foreground hover:border-ring focus:outline-none focus:ring-2 focus:ring-primary active:border-ring"
            placeholder={t("jury.searchPlaceholder")}
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterChange("voted")}
            aria-pressed={activeFilter === "voted"}
            className={`f-mono rounded-md px-3 py-2 text-sm font-medium transition ${
              activeFilter === "voted" ? activeFilterClass : inactiveFilterClass
            }`}
          >
            {t("jury.voted")}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("review")}
            aria-pressed={activeFilter === "review"}
            className={`f-mono rounded-md px-3 py-2 text-sm font-medium transition ${
              activeFilter === "review"
                ? activeFilterClass
                : inactiveFilterClass
            }`}
          >
            {t("jury.remaining")}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("refused")}
            aria-pressed={activeFilter === "refused"}
            className={`f-mono rounded-md px-3 py-2 text-sm font-medium transition ${
              activeFilter === "refused"
                ? activeFilterClass
                : inactiveFilterClass
            }`}
          >
            {t("jury.refused")}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            aria-pressed={activeFilter === "all"}
            className={`f-mono rounded-md px-3 py-2 text-sm font-medium transition ${
              activeFilter === "all" ? activeFilterClass : inactiveFilterClass
            }`}
          >
            {t("jury.filterAll")}
          </button>

          <div className="ml-2 flex min-w-[230px] items-center gap-3 pl-2">
            <span className="f-mono text-sm text-muted-foreground">
              {t("nav.stats.progress")}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary border border-border">
              <div
                className="h-full rounded-l-full rounded-r-none bg-gradient-to-r from-primary to-primary/60"
                style={{ width: `${progression}%` }}
              />
            </div>
            <span className="f-orb text-lg font-black text-primary">
              {decidedFilms}/{totalFilms}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
