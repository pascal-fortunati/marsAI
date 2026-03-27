// Type représentant les.badges de films
export type Badge = "grand_prix" | "prix_jury";

// Type représentant les détails d'un film
export type Film = {
  id: string;
  title: string;
  director: string;
  country: string;
  language: string | null;
  duration: string;
  year: number;
  synopsis: string;
  aiTools: string[];
  youtubeId: string | null;
  posterUrl: string | null;
  badge: Badge | null;
  prize?: string;
};

// Type représentant la réponse de l'API pour les palmarès
export type PalmaresResponse = {
  laureats: Film[];
  selection: Film[];
};
