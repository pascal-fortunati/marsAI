# Checklist conformité pro – Module Jury

## Accessibilité (WCAG/RGAA/ISO)

- [x] Langue de la page synchronisée avec l’interface (FR/EN)
- [x] Tous les champs de formulaire ont un label accessible (visible ou sr-only)
- [x] Les labels sont reliés aux champs (htmlFor/id)
- [x] Les boutons de filtre (toggle) exposent leur état (aria-pressed)
- [x] Lien d’évitement “Aller au contenu principal” présent et fonctionnel
- [x] Contraste texte/fond conforme (AA minimum sur tous les états)
- [x] Navigation clavier fluide (tab, focus visible, pas de piège)
- [ ] Test lecteur d’écran (NVDA, VoiceOver, etc.)
- [ ] Pas d’élément interactif sans nom accessible (boutons, liens, icônes)
- [ ] Pas de contenu animé non désactivable (hors décoratif)

## Sécurité & vie privée

- [ ] Pas de données sensibles en clair dans le code ou le DOM
- [ ] Authentification sécurisée (Google, tokens, etc.)
- [ ] Pas de XSS/CSRF évident (inputs filtrés, pas d’éval, etc.)
- [ ] Consentement cookies/analytics si tracking

## Performance & SEO

- [ ] Chargement rapide (Lighthouse > 80)
- [ ] Structure sémantique (h1, nav, main, footer, etc.)
- [ ] Titres de page et balises meta pertinents
- [ ] Images optimisées (taille, alt)
- [ ] Responsive/mobile first

## Documentation & maintenance

- [ ] README ou doc d’usage pour la section Jury
- [ ] Commentaires clairs sur les points complexes
- [ ] Tests unitaires ou manuels sur les cas critiques

---

> Cette checklist est à adapter pour chaque section du projet. Pour la conformité globale, chaque équipe doit valider sa propre partie.
