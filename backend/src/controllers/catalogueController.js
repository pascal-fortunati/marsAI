import { findAllCatalogueFilms, findCatalogueFilms, findFilmById } from "../models/catalogueModel.js";
import { findUploadedFilmById, listUploadedFilms } from "../services/uploadCatalogueService.js";

function parseJsonField(value) {
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return value ?? [];
        }
    }
    return value;
}

function prepareDbFilms(rows) {
    return rows.map((r) => ({
        ...r,
        ai_tools: parseJsonField(r.ai_tools),
        semantic_tags: parseJsonField(r.semantic_tags),
    }));
}

export async function getCatalogue(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page ?? "1", 10));
        const perPageRaw = req.query.per_page ?? req.query.perPage ?? "20";
        const perPage = Math.min(100, Math.max(1, parseInt(perPageRaw, 10)));
        const category = req.query.category || null;
        const q = req.query.q || null;

        const uploadsOnly = String(category ?? "").toLowerCase() === "uploads";
        if (uploadsOnly) {
            const uploads = await listUploadedFilms({ q });
            const offset = (page - 1) * perPage;
            return res.json({
                films: uploads.slice(offset, offset + perPage),
                pagination: {
                    page,
                    per_page: perPage,
                    total: uploads.length,
                    total_pages: Math.max(1, Math.ceil(uploads.length / perPage)),
                },
            });
        }

        if (!category) {
            const [uploads, rows] = await Promise.all([
                listUploadedFilms({ q }),
                findAllCatalogueFilms({ q }),
            ]);
            const combined = [...uploads, ...prepareDbFilms(rows)];
            const offset = (page - 1) * perPage;
            return res.json({
                films: combined.slice(offset, offset + perPage),
                pagination: {
                    page,
                    per_page: perPage,
                    total: combined.length,
                    total_pages: Math.max(1, Math.ceil(combined.length / perPage)),
                },
            });
        }

        const { rows, total } = await findCatalogueFilms({ page, perPage, category, q });
        return res.json({
            films: prepareDbFilms(rows),
            pagination: {
                page,
                per_page: perPage,
                total,
                total_pages: Math.ceil(total / perPage),
            },
        });
    } catch (err) {
        console.error("[getCatalogue]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}

export async function getFilmById(req, res) {
    try {
        const film = await findFilmById(req.params.id);
        if (!film) {
            const uploadedFilm = await findUploadedFilmById(req.params.id);
            if (!uploadedFilm) return res.status(404).json({ error: "Film introuvable" });
            return res.json(uploadedFilm);
        }

        return res.json({
            ...film,
            ai_tools: parseJsonField(film.ai_tools),
            semantic_tags: parseJsonField(film.semantic_tags),
            director_socials: parseJsonField(film.director_socials),
        });
    } catch (err) {
        console.error("[getFilmById]", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}
