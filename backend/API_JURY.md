# API Jury – Documentation rapide

## Authentification

Toutes les routes sont protégées par Google OAuth2. Pour accéder à l’API, il faut être connecté via /api/auth/login.

- **/api/auth/login** : démarre la connexion Google
- **/api/auth/callback** : callback Google (ne pas appeler directement)
- **/api/auth/logout** : déconnexion
- **/api/jury/me** : infos du membre du jury connecté

## Endpoints Jury

- **GET /api/films**
  - Retourne la liste des films assignés au jury connecté
  - Réponse : `{ films: [ ... ] }`

- **GET /api/films/:id**
  - Détails d’un film (titre, synopsis, vidéo, etc.)
  - Réponse : `{ id, title, ... }`

- **POST /api/vote**
  - Soumettre un vote/commentaire pour un film
  - Body : `{ filmId, decision, comment }`
  - Réponse : `{ ok: true, ... }`

- **GET /api/jury/me**
  - Infos du jury connecté (profil Google)
  - Réponse : `{ user: ... }`

## Sécurité

- Toutes les routes (hors /api/auth/\*) nécessitent une session valide.
- Les exemples actuels sont statiques, à adapter avec la base SQL.
