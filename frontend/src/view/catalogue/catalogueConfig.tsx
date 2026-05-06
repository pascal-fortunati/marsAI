import type { ReactNode } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import type { Badge } from "./catalogueTypes";

// Configuration des badges de la catégorie
export const BADGE_CFG: Record<
  Badge,
  { col: string; bg: string; border: string; icon: ReactNode }
> = {
  grand_prix: {
    col: "#ffd700",
    bg: "rgba(255,215,0,0.1)",
    border: "rgba(255,215,0,0.35)",
    icon: <EmojiEventsIcon fontSize="inherit" />,
  },
  prix_jury: {
    col: "#c0c0c0",
    bg: "rgba(192,192,192,0.1)",
    border: "rgba(192,192,192,0.3)",
    icon: <StarIcon fontSize="inherit" />,
  },
};

// Nombre d'éléments par page dans le catalogue
export const PER_PAGE = 20;
