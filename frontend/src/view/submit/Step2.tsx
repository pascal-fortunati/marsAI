import { FormField } from "../../components/FormField";

interface Step2Props {
    onNext: () => void;
    onPrev: () => void;
}

const AI_TOOLS = [
    "Sora", "MidJourney", "RunwayML", "Pika", "Kling", "DALL-E 3",
    "Stable Diffusion", "Fluxchlabs", "Suno", "Udio", "Montage",
    "Luma AI", "Runway Gen-3", "Hygen", "D-ID", "Synthesia", "Autre"
];

const TAGS = [
    "Futur souhaitable", "Écologie", "Humanité & IA", "Solidarité",
    "Espoir", "Résilience", "Utopie", "Nature", "Paix",
    "Innovation sociale", "Diversité", "Éducation", "Santé", "Liberté", "Mémoire"
];

