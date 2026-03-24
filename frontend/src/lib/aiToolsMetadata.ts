// Descriptions et métadonnées des outils IA populaires
export const AI_TOOLS_METADATA: Record<string, { description: string; category?: string }> = {
    // Génération vidéo
    "Runway": {
        description: "Plateforme de création vidéo alimentée par l'IA avec outils de montage, génération et transformation",
        category: "Video"
    },
    "Synthesia": {
        description: "Plateforme de création vidéo avec avatars IA et synthèse vocale",
        category: "Video"
    },
    "HeyGen": {
        description: "Outil de création vidéo avec avatars et vidéoconférence alimentés par l'IA",
        category: "Video"
    },
    "Pika": {
        description: "Générateur vidéo IA créant des clips à partir de texte et d'images",
        category: "Video"
    },
    "D-ID": {
        description: "Plateforme spécialisée dans la création de vidéos avec avatars numériques parlants",
        category: "Video"
    },

    // Génération d'images
    "Midjourney": {
        description: "Générateur d'images IA créant des images artistiques à partir de descriptions textuelles",
        category: "Image"
    },
    "DALL-E": {
        description: "Système de création d'images par IA d'OpenAI utilisant des descriptions en langage naturel",
        category: "Image"
    },
    "Stable Diffusion": {
        description: "Modèle open-source de génération d'images par diffusion latente",
        category: "Image"
    },
    "Adobe Firefly": {
        description: "Générateur d'images IA intégré à l'écosystème Adobe Creative Cloud",
        category: "Image"
    },
    "Ideogram": {
        description: "Générateur d'images IA spécialisé dans la génération de texte et de typographie",
        category: "Image"
    },

    // Édition et post-production
    "Descript": {
        description: "Outil de transcription et d'édition vidéo/audio basé sur le texte avec IA",
        category: "Editing"
    },
    "Opus Clip": {
        description: "Outil IA pour créer automatiquement des extraits courts de contenus longs",
        category: "Editing"
    },
    "Adobe Podcast": {
        description: "Outil de suppression du bruit et amélioration audio alimenté par l'IA",
        category: "Audio"
    },
    "Eleven Labs": {
        description: "Plateforme de synthèse vocale IA avec voix naturelles multilingues",
        category: "Audio"
    },

    // Musique et son
    "AIVA": {
        description: "Compositeur IA créant de la musique originale pour films et médias",
        category: "Music"
    },
    "Amper Music": {
        description: "Génération de musique IA pour créer des compositions originales personnalisées",
        category: "Music"
    },
    "Soundraw": {
        description: "Plateforme de création musicale IA avec générateur de musique personnalisable",
        category: "Music"
    },
    "MuBERT": {
        description: "Générateur de musique IA créant des compositions à partir de paramètres personnalisés",
        category: "Music"
    },

    // Animation
    "Motion": {
        description: "Tool pour créer des animations et des transitions avec des modèles IA",
        category: "Animation"
    },
    "Animaker": {
        description: "Plateforme de création de vidéos animées basée sur l'IA",
        category: "Animation"
    },
    "Powtoon": {
        description: "Outil de création de vidéos animées et de présentations avec assistance IA",
        category: "Animation"
    },

    // Autres outils
    "ChatGPT": {
        description: "Assistant IA multifonctionnel pour la rédaction, analyse et brainstorming",
        category: "Text"
    },
    "Claude": {
        description: "Assistant IA pour la rédaction, codage et analyse par Anthropic",
        category: "Text"
    },
    "NeuronML": {
        description: "Suite d'outils machine learning pour l'analyse de contenu",
        category: "ML"
    },
    "DeepDream": {
        description: "Outil de génération et transformation d'images assisté par réseau de neurones",
        category: "Image"
    },
    "TouchDesigner": {
        description: "Plateforme pour la création d'expériences visuelles avec composants média et IA",
        category: "Interactive"
    },
};

export function getAIToolDescription(toolName: string): string {
    return AI_TOOLS_METADATA[toolName]?.description || toolName;
}

export function getAIToolCategory(toolName: string): string | undefined {
    return AI_TOOLS_METADATA[toolName]?.category;
}
