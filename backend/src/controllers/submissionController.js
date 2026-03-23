import { createSubmission } from "../services/submissionService.js";

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

        const result = await createSubmission(body);

        return res.status(201).json({ id: result.id, email: result.email });
    } catch (err) {
        console.error("[submitFilm]", err);
        return res.status(500).json({ error: "Erreur serveur lors de la soumission" });
    }
}
