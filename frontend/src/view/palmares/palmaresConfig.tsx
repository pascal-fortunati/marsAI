import type { ReactNode } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import type { Badge } from "./palmaresTypes";

// Configuration des couleurs et icônes pour chaque badge de film
export const BADGE_CFG: Record<
  Badge,
  {
    color: string;
    icon: ReactNode;
    rank: number;
  }
> = {
  grand_prix: {
    color: "#ffd966",
    icon: <EmojiEventsIcon fontSize="inherit" />,
    rank: 1,
  },
  prix_jury: {
    color: "#c8c8ff",
    icon: <StarIcon fontSize="inherit" />,
    rank: 2,
  },
};
