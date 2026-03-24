# Setup OAuth Local - marsAI

## Objectif

Activer la connexion Google (jury) en local sur le projet marsAI.

## Ce qui a ete fait jusqu'ici

- Backend et frontend demarrent en local.
- La base MySQL `marsai` est chargee et contient des donnees (users, submissions, jury_votes, etc.).
- Le compte jury `sylvain.malbon@laplateforme.io` existe bien en base avec le role `jury`.
- Le backend est configure avec une origine CORS supplementaire pour le frontend local sur le port 4003.

## Fichiers de configuration utilises

- `backend/.env`
- `frontend/.env`
- `backend/sql/marsai.sql`

## Variables importantes

Dans `backend/.env`:

- `PORT=4000`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=` (adapter selon ton MySQL local)
- `DB_NAME=marsai`
- `CORS_ORIGIN=http://localhost:5173,http://localhost:4001,http://localhost:4003`
- `JWT_SECRET=...`
- `GOOGLE_CLIENT_ID=...`

Dans `frontend/.env`:

- `VITE_API_URL=http://localhost:4000`
- `VITE_GOOGLE_CLIENT_ID=...`

Important: `GOOGLE_CLIENT_ID` et `VITE_GOOGLE_CLIENT_ID` doivent contenir exactement la meme valeur (le Client ID OAuth Web Google).

## Etapes Google Cloud (depuis les parametres)

Depuis les parametres Google Cloud, enchaine comme ca:

1. Ouvre le menu en haut a gauche (`☰`).
2. Va dans `API et services`.
3. Clique `Ecran de consentement OAuth`.
4. Configure en `Externe` puis `Testing`.
5. Ajoute ton adresse Gmail dans `Test users`.
6. Ensuite va dans `Identifiants`.
7. Clique `Creer des identifiants` -> `ID client OAuth`.
8. Type: `Application Web`.
9. Ajoute les origines:
   - `http://localhost:4003`
   - `http://localhost:5173`
10. Cree et copie le `Client ID`.

## Ou coller le Client ID

- `backend/.env`: `GOOGLE_CLIENT_ID=TON_CLIENT_ID`
- `frontend/.env`: `VITE_GOOGLE_CLIENT_ID=TON_CLIENT_ID`

## Lancer le projet

Terminal 1 (backend):

- `cd backend`
- `npm run dev`

Terminal 2 (frontend):

- `cd frontend`
- `npm run dev -- --port 4003`

## Verification rapide

- Frontend: `http://localhost:4003`
- Health backend: `http://localhost:4000/api/health`
- Login Google avec un compte present dans `Test users`.

## Si la connexion Google echoue

Verifier dans cet ordre:

1. `GOOGLE_CLIENT_ID` rempli dans `backend/.env`.
2. `VITE_GOOGLE_CLIENT_ID` rempli dans `frontend/.env`.
3. Meme valeur exacte dans les 2 fichiers.
4. Origine locale ajoutee dans Google Cloud (`http://localhost:4003`).
5. Compte Google present dans `Test users`.
6. Utilisateur existant en base avec role `jury`.
