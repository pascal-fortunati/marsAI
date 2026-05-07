# marsAI

marsAI est une application web full-stack pour gerer un festival de films : site public, depots de films, espace jury et palmares.

## Stack

- Frontend : React + TypeScript + Vite + Tailwind + MUI
- Backend : Node.js + Express + MySQL + Passport (Google OAuth2)
- Outils : ESLint, Nodemon

## Fonctionnalites principales

- Pages publiques : accueil, depots, catalogue, palmares
- Connexion jury et flux de votes
- Modeles admin et jury (utilisateurs, soumissions, votes, decisions)
- Integrations email et stockage objet (Brevo, S3 compatible)

## Structure du projet

- backend : API Express, authentification, services, schema SQL
- frontend : application React (Vite), routes et UI

## Prerequis

- Node.js 18+ recommande
- MySQL 8+ (ou compatible)
- Docker + Docker Compose (pour le deploiement)

## Installation

Installer les dependances :

```bash
npm install --prefix backend
npm install --prefix frontend
```

Creer un fichier .env a la racine du depot (utilise par le backend) :

```bash
# Serveur
PORT=4000
SESSION_SECRET=change_me
JWT_SECRET=change_me
NODE_ENV=development
CORS_ORIGIN=http://localhost:4001

# Base de donnees
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=marsai

# Google OAuth2
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=

# YouTube (optionnel, reprend Google si vide)
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=
YOUTUBE_REFRESH_TOKEN=

# Brevo email (optionnel)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=marsAI

# S3 / Scaleway (optionnel)
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_ENDPOINT=
S3_BUCKET_NAME=
S3_REGION=
S3_FOLDER=
```

Initialiser la base de donnees avec le schema :

- Voir [backend/sql/schema.sql](backend/sql/schema.sql)
- Un dump d exemple existe dans [backend/sql/marsai.sql](backend/sql/marsai.sql)

## Lancer en developpement

Demarrer le backend :

```bash
npm run dev --prefix backend
```

Demarrer le frontend :

```bash
npm run dev --prefix frontend
```

Le backend tourne sur http://localhost:4000 et le frontend sur http://localhost:4001. En dev, le frontend proxy /api, /partners et /uploads vers le backend.

## Deploiement (Docker)

Site public : https://g3-marsai.dev-dwwm.ovh

Le projet est deployee sur un serveur via Docker Compose. Le fichier de compose a utiliser est [docker-compose.yml](docker-compose.yml).

Lancer les services :

```bash
docker compose -f "docker-compose.yml" up -d --build
```

Arreter les services :

```bash
docker compose -f "docker-compose.yml" down
```

Le reverse proxy HTTPS et le routage domaine sont geres par Nginx Proxy Manager.

## API

Doc rapide jury : [backend/API_JURY.md](backend/API_JURY.md)

Health check :

- GET /api/health

## Scripts

Scripts racine (voir package.json) :

- `npm run dev` -> frontend dev server
- `npm run dev:backend` -> backend dev server
- `npm run dev:all` -> frontend + backend (necessite concurrently)
