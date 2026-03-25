export type VoteAction = "validate" | "refuse" | "review";

export interface JuryFilm {
    id: string;
    title: string;
    synopsis: string;
    country: string;
    year: number;
    duration_seconds: number;
    category: string;
    director_name: string;
    video_url: string | null;
    ai_tools: string[];
    my_vote: VoteAction | null;
    my_comment: string | null;
}

export interface JuryStats {
    total: number;
    voted: number;
    remaining: number;
    progress: number;
}