import type { CatalogueResponse, CatalogueFilmDetail } from "../view/catalogue/CatalogueTypes";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export interface CatalogueParams {
    page?: number;
    per_page?: number;
    category?: string;
    q?: string;
}

export async function getCatalogue(params: CatalogueParams = {}): Promise<CatalogueResponse> {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.per_page) qs.set("per_page", String(params.per_page));
    if (params.category) qs.set("category", params.category);
    if (params.q) qs.set("q", params.q);

    const res = await fetch(`${BASE}/api/catalogue?${qs}`);
    if (!res.ok) throw new Error("Impossible de charger le catalogue");
    return res.json();
}

export async function getFilmById(id: string): Promise<CatalogueFilmDetail> {
    const res = await fetch(`${BASE}/api/catalogue/${id}`);
    if (!res.ok) throw new Error("Film introuvable");
    return res.json();
}