// Type représentant une étape de formulaire
export type Step = 0 | 1 | 2 | 3 | 4

// Type représentant les données du formulaire de soumission
export type FormData = {
    dirName: string
    dirEmail: string
    dirPhone: string
    dirStreet: string
    dirZip: string
    dirCity: string
    dirCountry: string
    dirBirthdate: string
    dirJob: string
    discovery: string
    additionalInfo: string
    socials: Record<string, string>
    title: string
    synopsis: string
    country: string
    language: string
    category: string
    year: string
    duration: string
    aiTools: string[]
    customAiTool: string
    semanticTags: string[]
    musicCredits: string
    rightsConfirmed: boolean
    legalName: string
    legalEmail: string
    videoFile: File | null
    posterFile: File | null
    subtitlesFile: File | null
    consentRules: boolean
    consentPromo: boolean
    consentNewsletter: boolean
    consentCopyright: boolean
}

// Clé de stockage pour les données du formulaire de soumission
export const STORAGE_KEY = 'marsai_submit_form'

// Fonction utilitaire pour créer les données par défaut du formulaire de soumission
export const defaultForm = (): FormData => ({
    dirName: '',
    dirEmail: '',
    dirPhone: '',
    dirStreet: '',
    dirZip: '',
    dirCity: '',
    dirCountry: '',
    dirBirthdate: '',
    dirJob: '',
    discovery: '',
    additionalInfo: '',
    socials: {},
    title: '',
    synopsis: '',
    country: '',
    language: '',
    category: '',
    year: '2026',
    duration: '',
    aiTools: [],
    customAiTool: '',
    semanticTags: [],
    musicCredits: '',
    rightsConfirmed: false,
    legalName: '',
    legalEmail: '',
    videoFile: null,
    posterFile: null,
    subtitlesFile: null,
    consentRules: false,
    consentPromo: false,
    consentNewsletter: false,
    consentCopyright: false,
})