export type FilmStatus = "pending" | "validated" | "refused" | "review" | "selected";
export type DecisionAction = "validated" | "refused" | "review";
export type BadgeType = "grand_prix" | "prix_jury" | null;
export type AdminTab = "films" | "site" | "partners" | "youtube" | "emails";

export interface AdminFilm {
    id: string;
    title: string;
    synopsis: string;
    country: string;
    year: number;
    duration_seconds: number;
    category: string;
    director_name: string;
    director_email: string;
    ai_tools: string[];
    status: FilmStatus;
    badge: BadgeType;
    youtube_private_id: string | null;
    poster_url: string | null;
    video_url: string | null;
    created_at: string;
    jury_votes: number;
}

export interface AdminStats {
    total: number;
    selected: number;
    pending: number;
    validated: number;
    review: number;
    refused: number;
}