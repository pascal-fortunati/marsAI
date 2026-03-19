import { useTranslation } from "react-i18next";
import type { Film } from "./types";

type FilmDetailProps = {
  film: Film | null;
};

export function FilmDetail({ film }: FilmDetailProps) {
  const { t } = useTranslation();

  if (!film) {
    return (
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {t("jury.filmDetailsTitle")}
        </h2>
        <p className="text-gray-400">{t("jury.filmSelectPrompt")}</p>
      </div>
    );
  }

  const tags = film.tags ?? [];

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">{film.title}</h2>
      <p className="mt-1 text-sm text-gray-400">
        {[film.country, film.duration].filter(Boolean).join(" • ") ||
          t("jury.unknownYear", { defaultValue: "Année inconnue" })}
      </p>

      <div className="mt-5 space-y-2">
        <p className="text-gray-200">
          {film.synopsis ??
            t("jury.synopsisUnavailable", {
              defaultValue: "(Synopsis non disponible)",
            })}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-700 bg-slate-950 px-3 py-1 text-xs text-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
