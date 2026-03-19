import { useTranslation } from "react-i18next";

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
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-gray-700 bg-slate-950 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={`\u{1F50D} ${t("jury.searchPlaceholder")}`}
          value={query}
          onChange={(event) => onSearch(event.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
