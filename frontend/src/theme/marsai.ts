// Couleurs de marsAI
export const marsaiColors = {
  bg: "#05030d",
  panelBg: "#0c0c0e",
  primary: "#7d71fb",
  primary2: "#9d6fff",
  accent: "#ff5c35",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  violetSoft: "#a78bfa",
  gold: "#ffd700",
  silver: "#c0c0c0",
  cyan: "#06b6d4",
  bgdark: "#140e50",
} as const;

// Fonction utilitaire pour ajouter une opacité à une couleur hexadécimale
export function withAlpha(hex: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Gradients de marsAI
export const marsaiGradients = {
  primary: `linear-gradient(135deg,${marsaiColors.primary},${marsaiColors.primary2})`,
  primaryToAccent: `linear-gradient(135deg,${marsaiColors.primary},${marsaiColors.accent})`,
} as const;
