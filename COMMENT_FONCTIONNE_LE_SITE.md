# Comment fonctionne le site MarsAI

Ce document explique le fonctionnement global du site, côté frontend et backend, ainsi que les principaux flux métier (connexion, consultation des films, vote du jury).

## 1. Vue d'ensemble

- Le site est une application web orientée espace jury.
- Le frontend est une SPA React (Vite + TypeScript).
- Le backend est une API Express (Node.js + MySQL).
- L'authentification principale passe par Google OAuth (ID token), avec un mode démo local côté frontend.

## 2. Architecture du projet

### Frontend

- Point d'entrée: `frontend/src/main.tsx`
- Routage principal: `frontend/src/App.tsx`
- Page principale jury: `frontend/src/pages/JuryPage.tsx`
- Vue connectée jury: `frontend/src/view/jury/JuryView.tsx`
- Vue de connexion: `frontend/src/view/jury/LoginView.tsx`
- Client API: `frontend/src/lib/api.ts`
- Internationalisation: `frontend/src/lib/i18n.ts` et `frontend/src/lib/i18nResources.ts`
- Thème clair/sombre: `frontend/src/lib/theme.ts` + variables CSS dans `frontend/src/App.css`

### Backend

- Point d'entrée serveur: `backend/src/server.js`
- Initialisation Express + middleware: `backend/src/app.js`
- Authentification: `backend/src/routes/auth.js`
- Jury (films + vote): `backend/src/routes/jury.js`
- Santé service: `backend/src/routes/health.js`
- Connexion base de données: `backend/src/config/db.js`
- Variables d'environnement: `backend/src/config/env.js`
- Middleware JWT/roles: `backend/src/middleware/auth.js`

## 3. Navigation côté frontend

Le routage est volontairement simple:

- `/` redirige vers `/jury`
- `/jury` affiche la page du jury
- toute route inconnue redirige vers `/jury`

Cela est défini dans `frontend/src/App.tsx`.

## 4. Flux d'authentification

## 4.1 Vérification de session au chargement

Dans `frontend/src/pages/JuryPage.tsx`:

1. Le frontend lit le token stocké localement (`marsai_token`).
2. Si aucun token: affichage de la page de connexion.
3. Si token démo: accès direct à la vue jury.
4. Sinon: appel `GET /api/auth/me` pour vérifier le token JWT.
5. Si valide: accès jury, sinon suppression du token et retour à la connexion.

## 4.2 Connexion Google

Dans `frontend/src/view/jury/LoginView.tsx`:

1. Chargement du script Google Identity Services.
2. Récupération d'un `credential` Google côté navigateur.
3. Envoi du credential à `POST /api/auth/google`.
4. Le backend vérifie le token Google, trouve/crée l'utilisateur en base, puis renvoie un JWT applicatif.
5. Le JWT est stocké dans `localStorage` et l'utilisateur est connecté.

## 4.3 Mode démo local

Toujours dans `LoginView.tsx`, un bouton permet de continuer en démo:

- un token sentinelle local est stocké (`__marsai_demo_local__`)
- aucun appel backend n'est nécessaire pour simuler l'espace jury
- les votes sont manipulés uniquement dans l'état frontend

## 5. Flux métier jury (films et votes)

Dans `frontend/src/view/jury/JuryView.tsx`:

1. Chargement des films:
   - en démo: données statiques `DEMO_FILMS`
   - en mode normal: `GET /api/films`
2. Pré-remplissage des votes/commentaires à partir de la réponse API.
3. Filtrage local des films par:
   - état (`all`, `voted`, `remaining`)
   - recherche texte (titre, pays, tags)
4. Sélection automatique d'un film valide quand la liste filtrée change.
5. Vote utilisateur via `POST /api/vote` avec payload:
   - `filmId`
   - `decision` (`validate`, `review`, `refuse`)
   - `comment` optionnel
6. Mise à jour de l'UI:
   - statistiques (validés, à revoir, refusés, restants)
   - progression globale en pourcentage

## 6. API backend utilisée par le frontend

### Auth

- `POST /api/auth/google`: échange credential Google contre JWT applicatif
- `GET /api/auth/me`: vérifie le JWT et renvoie l'utilisateur courant
- `POST /api/auth/demo`: renvoie un utilisateur de démonstration

### Jury

- `GET /api/films`: liste des films accessibles au jury connecté
- `GET /api/films/:id`: détail d'un film si autorisé
- `POST /api/vote`: enregistre un vote du jury sur un film

### Santé et documentation

- `GET /api/health`: état du service
- `GET /api/docs`: documentation Swagger UI

## 7. Règles d'accès et sécurité

- Le backend protège les routes sensibles avec JWT (`requireAuth`).
- Les rôles autorisés au périmètre jury sont `jury`, `admin`, `moderator`.
- Pour les rôles non admin/moderator, un film doit être assigné au jury (`jury_assignments`) pour être visible/votable.
- En cas de réponse HTTP 401, le frontend supprime automatiquement le token local.

## 8. Gestion du thème

- Le thème est piloté par l'attribut `data-theme` sur `<html>`.
- Valeurs supportées: `light` et `dark`.
- Persistance via `localStorage` (`marsai-theme`).
- Initialisation avant rendu React dans `frontend/src/main.tsx` via `initializeTheme()`.
- Les composants utilisent majoritairement des tokens sémantiques (`bg-card`, `text-foreground`, `border-border`) reliés aux variables CSS de `App.css`.

## 9. Internationalisation (FR/EN)

- Initialisation i18next dans `frontend/src/lib/i18n.ts`.
- Langue détectée depuis `localStorage`, sinon langue navigateur.
- Ressources statiques dans `frontend/src/lib/i18nResources.ts`.
- Changement de langue depuis la navbar (FR/EN) et persistance locale.

## 10. Démarrage en local

## Backend

- Installer les dépendances dans `backend`
- Lancer en développement: `npm run dev`
- Port habituel: `4000`

## Frontend

- Installer les dépendances dans `frontend`
- Lancer en développement: `npm run dev`
- Port Vite habituel: `5173` (ou autre selon disponibilité)

## Variables utiles

- `VITE_API_URL` (frontend): URL de l'API cible
- `VITE_GOOGLE_CLIENT_ID` (frontend): client ID Google
- variables backend (DB, JWT, CORS, Google) dans l'environnement serveur

## 11. Résumé rapide du cycle utilisateur

1. L'utilisateur ouvre `/jury`.
2. S'il n'est pas connecté, il passe par Google (ou mode démo).
3. Le frontend charge les films assignés.
4. Le jury filtre, consulte vidéo + détails, et vote.
5. Le backend enregistre le vote et met à jour le statut de la soumission.
6. L'interface met à jour les compteurs et la progression en temps réel.
