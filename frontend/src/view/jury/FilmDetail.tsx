import type { Film } from "./types";

type FilmDetailProps = {
  film: Film | null;
};

export function FilmDetail({ film }: FilmDetailProps) {
  if (!film) {
    return (
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Détails du film</h2>
        <p className="text-gray-400">
          Sélectionne un film pour voir les détails.
        </p>
      </div>
    );
  }

  // TODO: enrichir avec plus de données (synopsis, durée, casting, etc.)
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{film.title}</h2>
      <p className="text-sm text-gray-400">{film.year ?? "Année inconnue"}</p>
      <div className="mt-4 space-y-2">
        <p className="text-gray-200">
          {film.synopsis ?? "(Synopsis non disponible)"}
        </p>
        <p className="text-sm text-gray-400">
          Réalisateur : {film.director ?? "—"}
        </p>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        TODO: afficher plus d&apos;infos (genre, durée, casting, notes, etc.)
      </p>
    </div>
  );
}
