import { db } from "../config/db.js";
import { randomUUID } from "node:crypto";

export async function insertSubmission(data) {
    const id = randomUUID();

    await db.execute(
        `INSERT INTO submissions (
            id,
            title, synopsis, country, language, category,
            year, duration_seconds, ai_tools, semantic_tags,
            music_credits, rights_confirmed,
            director_name, director_email, director_phone,
            director_street, director_zip, director_city, director_country,
            director_birthdate, director_job, director_socials, discovery_source,
            legal_ref_name, legal_ref_email,
            poster_url, video_url, subtitles_url,
            consent_rules, consent_promo, consent_newsletter, consent_copyright,
            status
        ) VALUES (
            ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      'pending'
        )`,
        [
            id,
            // Film
            data.title,
            data.synopsis,
            data.country,
            data.language,
            data.category,
            new Date().getFullYear(),
            data.duration_seconds,
            JSON.stringify(data.ai_tools || []),
            JSON.stringify(data.semantic_tags || []),
            data.music_credits,
            data.rights_confirmed ? 1 : 0,
            // Réalisateur
            data.director_name,
            data.director_email,
            data.director_phone || null,
            data.director_street || null,
            data.director_zip || null,
            data.director_city || null,
            data.director_country || null,
            data.director_birthdate || null,
            data.director_job || null,
            JSON.stringify(data.director_socials || {}),
            data.discovery_source || null,
            // Référent légal
            data.legal_ref_name || null,
            data.legal_ref_email || null,
            // Fichiers
            data.poster_url || null,
            data.video_url || null,
            data.subtitles_url || null,
            // Consentements
            data.consent_rules ? 1 : 0,
            data.consent_promo ? 1 : 0,
            data.consent_newsletter ? 1 : 0,
            data.consent_copyright ? 1 : 0,
        ]
    );
    return id;
};