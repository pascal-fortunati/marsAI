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
