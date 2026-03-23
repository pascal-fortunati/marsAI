export type Film = {
  id: string;
  title: string;
  country?: string;
  duration?: string;
  synopsis?: string;
  tags?: string[];
  year?: string;
  director?: string;
  youtubeId?: string;
  // TODO: ajouter les champs nécessaires (durée, genres, participants, etc.)
};

export type VoteDecision = "validate" | "refuse" | "review";

export function getFilmNumberPrefix(film: Pick<Film, "id">): string | null {
  const numericId = Number.parseInt(film.id.replace(/\D/g, ""), 10);
  if (!Number.isNaN(numericId)) {
    return `#${numericId}`;
  }
  return null;
}

export function formatFilmDisplayTitle(film: Pick<Film, "id" | "title">): string {
  const prefix = getFilmNumberPrefix(film);
  if (prefix) {
    return `${prefix} ${film.title}`;
  }
  return film.title;
}
