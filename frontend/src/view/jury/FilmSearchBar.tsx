import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

type FilmSearchBarProps = {
  query: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
};

export function FilmSearchBar({
  query,
  onSearch,
  disabled,
}: FilmSearchBarProps) {
  const { t } = useTranslation();

  // TODO: appeler l'API /api/films?search=...
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/45 p-8 text-white shadow-lg">
      <div className="relative flex gap-2">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45"
          aria-hidden="true"
        />
        <input
          className="flex-1 rounded border border-slate-800 bg-slate-900/30 py-2 pl-12 pr-3 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={t("jury.searchPlaceholder")}
          value={query}
          onChange={(event) => onSearch(event.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
