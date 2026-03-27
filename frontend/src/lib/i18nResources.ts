import { frTranslation } from "../localize/fr/resources";
import { enTranslation } from "../localize/en/resources";

export const resources = {
  fr: { translation: frTranslation },
  en: { translation: enTranslation },
} as const;
