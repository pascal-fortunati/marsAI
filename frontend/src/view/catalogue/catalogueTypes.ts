// Types de badge pour les films
export type Badge = "grand_prix" | "prix_jury";

// Type de film avec toutes les propriétés nécessaires
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
  prize?: string | null;
};

// Type de réponse de l'API pour le catalogue de films
export type CatalogueResponse = {
  items: Film[];
  page: number;
  pageSize: number;
  total: number;
};
