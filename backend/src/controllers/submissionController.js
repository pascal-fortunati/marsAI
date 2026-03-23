import { createSubmission } from "../services/submissionService.js";

function normalizeBirthdate(input) {
    const raw = String(input ?? "").trim();
    if (!raw) return null;

    const isValidYmd = (year, month, day) => {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
        if (year < 1900 || year > 2100) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        const date = new Date(Date.UTC(year, month - 1, day));
        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    };

    const toYmd = (year, month, day) => {
        if (!isValidYmd(year, month, day)) return null;
        const y = String(year).padStart(4, "0");
        const m = String(month).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const isoDateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateOnly) {
        return toYmd(Number(isoDateOnly[1]), Number(isoDateOnly[2]), Number(isoDateOnly[3]));
    }

    const isoDateTime = raw.match(/^(\d{4})-(\d{2})-(\d{2})T/);
    if (isoDateTime) {
        return toYmd(Number(isoDateTime[1]), Number(isoDateTime[2]), Number(isoDateTime[3]));
    }

    const frSlash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (frSlash) {
        return toYmd(Number(frSlash[3]), Number(frSlash[2]), Number(frSlash[1]));
    }

    const frDash = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (frDash) {
        return toYmd(Number(frDash[3]), Number(frDash[2]), Number(frDash[1]));
    }

    const timestamp = Number(raw);
    if (Number.isFinite(timestamp) && timestamp > 0) {
        const fromTs = new Date(timestamp);
        if (!Number.isNaN(fromTs.getTime())) {
            return toYmd(fromTs.getUTCFullYear(), fromTs.getUTCMonth() + 1, fromTs.getUTCDate());
        }
    }

    const genericDate = new Date(raw);
    if (!Number.isNaN(genericDate.getTime())) {
        return toYmd(genericDate.getUTCFullYear(), genericDate.getUTCMonth() + 1, genericDate.getUTCDate());
    }

    return null;
}

export async function submitFilm(req, res) {
    try {
        const body = req.body;

        const required = [
            ["director_name", "Nom du réalisateur"],
            ["director_email", "Email du réalisateur"],
            ["director_phone", "Téléphone"],
            ["director_birthdate", "Date de naissance"],
            ["director_street", "Adresse"],
            ["director_zip", "Code postal"],
            ["director_city", "Ville"],
            ["director_country", "Pays"],
            ["director_job", "Métier"],
            ["discovery_source", "Comment avez-vous connu MarsAI"],
            ["legal_ref_name", "Nom du référent légal"],
            ["legal_ref_email", "Email du référent légal"],
            ["title", "Titre du film"],
            ["synopsis", "Synopsis"],
            ["duration_seconds", "Durée"],
            ["country", "Pays de production"],
            ["language", "Langue"],
            ["category", "Catégorie"],
        ];

        for (const [field, label] of required) {
            if ((!body[field]) && body[field] !== 0) {
                return res.status(400).json({ error: `Le champ "${label}"` });
            }
        }

        // Consentement obligatoire
        if (!body.consent_rules || !body.consent_promo || !body.consent_copyright) {
            return res.status(400).json({ error: "Tous les consentements sont obligatoires." });
        }

        const directorBirthdate = normalizeBirthdate(body.director_birthdate);
        if (!directorBirthdate) {
            return res.status(400).json({ error: "Format de date de naissance invalide (attendu: YYYY-MM-DD)." });
        }

        const payload = {
            ...body,
            director_birthdate: directorBirthdate,
        };

        const result = await createSubmission(payload);

        return res.status(201).json({ id: result.id, email: result.email });
    } catch (err) {
        console.error("[submitFilm]", err);
        return res.status(500).json({ error: "Erreur serveur lors de la soumission" });
    }
}
