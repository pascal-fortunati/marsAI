import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './i18nResources'
// Clé de stockage pour la langue sélectionnée
const STORAGE_KEY = 'marsai_lang'

// Détecte la langue à utiliser en fonction de la configuration de l'utilisateur
function detectLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'fr' || stored === 'en') return stored
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('fr')) return 'fr'
  if (nav.startsWith('en')) return 'en'
  return 'fr'
}

// Initialise i18next avec les ressources et la langue détectée
i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

// Change la langue utilisée par i18next et stocke la sélection dans le stockage local
export function setLanguage(lang: 'fr' | 'en') {
  localStorage.setItem(STORAGE_KEY, lang)
  void i18n.changeLanguage(lang)
}

// Applique les traductions d'un objet à la langue spécifiée
function applyObject(lng: 'fr' | 'en', baseKey: string, value: unknown) {
  if (Array.isArray(value) || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
    ; (i18n as unknown as { addResource: (lng: string, ns: string, key: string, value: unknown) => void }).addResource(lng, 'translation', baseKey, value)
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    applyObject(lng, `${baseKey}.${k}`, v)
  }
}

// Applique les traductions de la home à la langue spécifiée
export function applyRuntimeHomeTranslations(input: { fr?: Record<string, unknown>; en?: Record<string, unknown> } | null | undefined) {
  if (!input) return
  if (input.fr && typeof input.fr === 'object') applyObject('fr', 'home', input.fr)
  if (input.en && typeof input.en === 'object') applyObject('en', 'home', input.en)
}

// Export de i18next pour être utilisé dans les composants React
export default i18n