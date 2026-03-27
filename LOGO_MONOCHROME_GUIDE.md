# Guide Logo MarsAI

Ce document est la reference logo pour le frontend actuel.

## Etat actuel du projet

Les fichiers presents sont:

```text
frontend/src/assets/
├── marsai_logo.png
├── marsai_logo-clair.png
├── marsai_logo-clair_fondnoir.png
└── react.svg
```

Usage actuel dans le code:

- Navbar:
  - mode sombre: `marsai_logo.png`
  - mode clair: `marsai_logo-clair.png`
- Login jury: `marsai_logo.png`
- Favicon: non configure actuellement dans `frontend/index.html`

Conclusion: l'ancienne version de ce guide n'etait plus a jour.

## Regle retenue

Oui, on garde la logique suivante:

- les logos couleur restent utilises dans l'interface (navbar/login)
- la version monochrome (noir ou blanc) est reservee au favicon

## Nommage recommande pour le favicon monochrome

Placer les favicons dans `frontend/public/`:

```text
frontend/public/
├── favicon-black.svg
├── favicon-white.svg
└── favicon.ico
```

Notes:

- `favicon-black.svg`: a utiliser par defaut (fonds clairs)
- `favicon-white.svg`: utile si tu veux une version alternative
- `favicon.ico`: fallback navigateur

## Integration HTML recommandee

Dans `frontend/index.html`, ajouter dans `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon-black.svg" />
<link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
```

## Ce qu'on ne fait pas

- pas de bascule automatique du logo principal de l'UI vers un monochrome noir/blanc
- pas de dependance a des fichiers `mars_ai_logo_black.*` qui n'existent pas dans le projet

## Checklist

- [x] Le guide correspond aux vrais noms de fichiers
- [x] La politique "monochrome pour favicon uniquement" est documentee
- [ ] Ajouter physiquement les fichiers `favicon-black.svg`, `favicon-white.svg`, `favicon.ico`
- [ ] Ajouter les balises favicon dans `frontend/index.html`

---

Derniere mise a jour: 25 mars 2026
