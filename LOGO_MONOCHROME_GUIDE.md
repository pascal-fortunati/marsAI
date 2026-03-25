# Guide Logo MarsAI - Version Monochrome Noir

## 📋 Spécifications du Logo

### Version Flat Design Monochrome Noir

Le logo MarsAI comporte une version monochrome noir à fond transparent (`mars_ai_logo_black.png` ou `.svg`) destinée à être utilisée dans les contextes suivants :

### Contextes d'utilisation

- **Fonds clairs / Mode Light** : Logo noir monochrome sur fond transparent
- **Icônes / Favicons** : Logo noir monochrome pour les favicons et petites tailles
- **Impressions / PDF** : Logo noir monochrome pour les documents officiels
- **Email signatures** : Logo noir monochrome sur fond blanc

### Couleurs

- **Couleur primaire** : `#000000` (noir pur)
- **Fond** : Transparent (PNG) ou Aucun (SVG)
- **Padding / Margin** : Minimum 8px autour du logo

### Tailles recommandées

| Contexte                | Taille                  | Format         |
| ----------------------- | ----------------------- | -------------- |
| Navigation (Light Mode) | 48x48 px                | PNG / SVG      |
| Logo Header complet     | 56x56 px                | PNG / SVG      |
| Favicon                 | 32x32 px                | ICO / PNG      |
| Signature Email         | 128x128 px / 200x200 px | PNG            |
| Documents               | 200x200 px+             | SVG (scalable) |

### Fichiers attendus

```
frontend/src/assets/
├── mars_ai_logo.png              (couleur, utilisé actuellement)
├── mars_ai_logo_black.png        (monochrome noir, transparent)
├── mars_ai_logo_black.svg        (monochrome noir, vectoriel)
└── mars_ai_logo_favicon.ico      (favicon favori)
```

## 🎨 Design Guidelines

### Proportions

- **Hauteur** : Toujours scaler proportionnellement
- **Aspect ratio** : Carré (1:1) recommandé
- **Padding recommandé** : 8-12% de la taille du logo

### Utilisation en mode clair

```tsx
// Mode Light : Logo noir
const logoSrc =
  theme === "light"
    ? "/assets/mars_ai_logo_black.png"
    : "/assets/mars_ai_logo.png";
```

### Contraste

- **Sur fond blanc** : Contraste WCAG AAA ✓ (21:1)
- **Sur fond très clair** : Résultat excellent
- **Sur fond transparent** : Convient à tout arrière-plan en-dessous

## 🔧 Intégration Technique

### Mettre à jour NavBar pour logo dynamique

```tsx
// Dans frontend/src/components/ui/NavBar.tsx
import { getStoredTheme } from "../../lib/theme";

// Dans le composant
const theme = getStoredTheme();
const logoPath = theme === "light" ? "mars_ai_logo_black" : "mars_ai_logo";

<img
  src={`/assets/${logoPath}.png`}
  alt="Mars AI logo"
  className="h-full w-full object-contain"
/>;
```

### HTML Meta Tags pour Favicon

```html
<link rel="icon" type="image/x-icon" href="/assets/mars_ai_logo_favicon.ico" />
<link rel="apple-touch-icon" href="/assets/mars_ai_logo_black.png" />
```

## 📐 Spécifiations technique SVG (optionnel)

Si le logo est fourni en SVG :

```xml
<svg
  viewBox="0 0 256 256"
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  fill="#000000"
>
  <!-- Contenu du logo -->
</svg>
```

- **ViewBox** : Maintenir les proportions 1:1
- **Fill** : `#000000` pour la version monochrome
- **Stroke** : Si applicable, `#000000`

## ✅ Checklist Production

- [ ] Logo noir PNG créé (transparent background)
- [ ] Logo noir SVG créé (haute qualité)
- [ ] Favicon ICO créé (32x32 min)
- [ ] NavBar.tsx mis à jour avec logique dynamique
- [ ] HTML `<head>` mis à jour avec meta tags
- [ ] Tous les fichiers placés dans `/frontend/src/assets/`
- [ ] Non-regression test en mode light et dark
- [ ] Affichage correct sur tous les appareils

## 🌐 Versions disponibles

| Version         | Fichier                    | Arrière-plan | Utilisation             |
| --------------- | -------------------------- | ------------ | ----------------------- |
| Couleur         | `mars_ai_logo.png`         | N/A          | Mode dark, web standard |
| Monochrome Noir | `mars_ai_logo_black.png`   | Transparent  | Mode light, impressions |
| Vectoriel       | `mars_ai_logo_black.svg`   | Transparent  | Tous usages (scalable)  |
| Favicon         | `mars_ai_logo_favicon.ico` | Aucun        | Onglet du navigateur    |

## 📝 Notes Importantes

1. **Transparence** : Le logo noir doit avoir un fond transparent (canal alpha)
2. **Contraste minimum** : WCAG AA minimum sur tous les fonds
3. **Taille minimum** : 32x32 px pour la lisibilité
4. **Export** : Exporter en PNG et SVG pour flexibilité maximale

---

**Date de mise à jour** : 24 mars 2026  
**Statut** : Documentation guidée
