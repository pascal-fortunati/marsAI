import { getCountryCode } from "../../lib/countryMapping";
import * as FlagIcons from "country-flag-icons/react/3x2";
import type { ComponentType, SVGProps } from "react";

/**
 * Formate la durée en secondes au format MM'SS
 */
export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}'${String(s).padStart(2, "0")}`;
}

/**
 * Retourne le drapeau emoji pour un pays
 */
export function getFlag(country: string): string {
    const code = getCountryCode(country ?? "");
    if (!code) return "🌍";

    // Convertir le code pays (ex: "FR") en emoji drapeau
    const codePoints = code
        .toUpperCase()
        .split("")
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

/**
 * Récupère le composant drapeau SVG pour un pays
 */
export function getFlagComponent(
    country: string
): ComponentType<SVGProps<SVGSVGElement>> | null {
    const code = getCountryCode(country ?? "");
    if (!code) return null;

    const flag = (FlagIcons as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[code];
    return flag ?? null;
}

/**
 * Configuration des badges (grand_prix, prix_jury, etc.)
 */
export const BADGE_CONFIG: Record<
    string,
    { label: string; color: string; icon: string }
> = {
    grand_prix: {
        label: "Grand Prix",
        color: "#FBBF24",
        icon: "🏆",
    },
    prix_jury: {
        label: "Prix du Jury",
        color: "#C084FC",
        icon: "⭐",
    },
    prix_public: {
        label: "Prix du Public",
        color: "#60A5FA",
        icon: "👑",
    },
    prix_special: {
        label: "Prix Spécial",
        color: "#34D399",
        icon: "✨",
    },
};
