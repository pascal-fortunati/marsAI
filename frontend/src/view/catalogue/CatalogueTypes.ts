export interface CatalogueFilm {
    id: string;
    title: string;
    synopsis: string;
    country: string;
    language: string;
    category: string;
    year: number;
    duration_seconds: number;
    ai_tools: string[];
    semantic_tags: string[];
    director_name: string;
    poster_url: string | null;
    youtube_public_id: string | null;
    status: string;
    badge: string | null;
    prize: string | null;
}

export interface CatalogueFilmDetail extends CatalogueFilm {
    music_credits: string | null;
    director_socials: Record<string, string>;
    director_job: string | null;
    director_country: string | null;
    admin_comment: string | null;
    video_url: string | null;
    subtitles_url: string | null;
}

export interface CataloguePagination {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface CatalogueResponse {
    films: CatalogueFilm[];
    pagination: CataloguePagination;
}