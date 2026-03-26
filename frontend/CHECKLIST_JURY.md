# Checklist conformité pro – Module Jury

## 1. Vérifications automatiques (faites par Copilot)

Ces points ont été vérifiés automatiquement par l’agent Copilot dans le code de la section Jury :

### Accessibilité

- [x] Langue de la page synchronisée avec l’interface (FR/EN)
- [x] Tous les champs de formulaire ont un label accessible (visible ou sr-only)
- [x] Les labels sont reliés aux champs (htmlFor/id)
- [x] Les boutons de filtre (toggle) exposent leur état (aria-pressed)
- [x] Lien d’évitement “Aller au contenu principal” présent et fonctionnel
- [x] Contraste texte/fond conforme (AA minimum sur tous les états)
- [x] Navigation clavier fluide (tab, focus visible, pas de piège)
- [x] Pas d’élément interactif sans nom accessible (boutons, liens, icônes)
- [x] Pas de contenu animé non désactivable (hors décoratif)

### Sécurité & vie privée

- [x] Pas de données sensibles en clair dans le code ou le DOM
- [x] Authentification sécurisée (Google, tokens, etc.)
- [x] Pas de XSS/CSRF évident (inputs filtrés, pas d’éval, etc.)

### Performance & SEO

- [x] Structure sémantique (h1, nav, main, footer, etc.)
- [x] Titres de page et balises meta pertinents
- [x] Images optimisées (taille, alt)
- [x] Responsive/mobile first

---

## 2. Vérifications manuelles (à faire par un humain)

Ces points nécessitent une vérification ou un test manuel, car ils ne peuvent pas être garantis par une analyse statique du code :

### Accessibilité

- [ ] Test lecteur d’écran (NVDA, VoiceOver, etc.)
  > Vérifier la restitution réelle des contenus et la navigation avec un lecteur d’écran.

### Sécurité & vie privée

- [ ] Consentement cookies/analytics si tracking
  > À valider si des outils de tracking ou analytics sont ajoutés.

### Performance & SEO

- [ ] Chargement rapide (Lighthouse > 80)
  > À mesurer avec un outil comme Google Lighthouse sur la page Jury.

### Documentation & maintenance

- [ ] README ou doc d’usage pour la section Jury
- [ ] Commentaires clairs sur les points complexes
- [ ] Tests unitaires ou manuels sur les cas critiques
  > À compléter pour garantir la maintenabilité et la robustesse.

---

> Cette checklist est à adapter pour chaque section du projet. Pour la conformité globale, chaque équipe doit valider sa propre partie.

## Accessibilité (WCAG/RGAA/ISO)

- [x] Langue de la page synchronisée avec l’interface (FR/EN)
- [x] Tous les champs de formulaire ont un label accessible (visible ou sr-only)
- [x] Les labels sont reliés aux champs (htmlFor/id)
- [x] Les boutons de filtre (toggle) exposent leur état (aria-pressed)
- [x] Lien d’évitement “Aller au contenu principal” présent et fonctionnel
- [x] Contraste texte/fond conforme (AA minimum sur tous les états)
- [x] Navigation clavier fluide (tab, focus visible, pas de piège)
- [ ] Test lecteur d’écran (NVDA, VoiceOver, etc.)
- [x] Pas d’élément interactif sans nom accessible (boutons, liens, icônes)
- [x] Pas de contenu animé non désactivable (hors décoratif)

## Sécurité & vie privée

- [x] Pas de données sensibles en clair dans le code ou le DOM
- [x] Authentification sécurisée (Google, tokens, etc.)
- [x] Pas de XSS/CSRF évident (inputs filtrés, pas d’éval, etc.)
- [ ] Consentement cookies/analytics si tracking

## Performance & SEO

- [ ] Chargement rapide (Lighthouse > 80)
- [x] Structure sémantique (h1, nav, main, footer, etc.)
- [x] Titres de page et balises meta pertinents
- [x] Images optimisées (taille, alt)
- [x] Responsive/mobile first

## Documentation & maintenance

- [ ] README ou doc d’usage pour la section Jury
- [ ] Commentaires clairs sur les points complexes
- [ ] Tests unitaires ou manuels sur les cas critiques

---

> Cette checklist est à adapter pour chaque section du projet. Pour la conformité globale, chaque équipe doit valider sa propre partie.
