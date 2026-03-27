// Étape 1 - Réalisateur
export interface Step1Data {
    director_name: string;
    director_email: string;
    director_phone: string;
    director_birthdate: string;
    director_street: string;
    director_zip: string;
    director_city: string;
    director_country: string;
    director_job: string;
    discovery_source: string;
    director_socials: string;
    legal_ref_name: string;
    legal_ref_email: string;
}

// Étape 2 - Film
export interface Step2Data {
    title: string;
    synopsis: string;
    country: string;
    language: string;
    category: string;
    ai_tools: string;
    sementic_tags: string;
    music_credits: string;
    rights_confirmed: boolean;
}

// Étape 3 - Fichiers
export interface Step3Data {
    submission_id: string;
    video_url: string;
    poster_url: string;
    subtitles_url: string;
}

// Étape 4 - Consentements
export interface Step4Data {
    consent_rules: boolean;
    consent_promo: boolean;
    consent_newsletter: boolean;
    consent_copyright: boolean;
}

// Payload envoyé au backend
export type SubmitPayload = Step1Data & Step2Data & Step3Data & Step4Data;