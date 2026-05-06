import express from "express";
import { ensureAuthenticated } from "../auth/ensureAuthenticated.js";
// import { db } from "../config/db.js"; // Pour accès SQL si besoin

const router = express.Router();

// GET /api/films : liste des films assignés au jury connecté
router.get("/films", ensureAuthenticated, async (req, res) => {
  // TODO: filtrer selon le jury connecté (req.user)
  // Exemple statique :
  res.json({
    films: [
      {
        id: "1",
        title: "Mars, la conquête",
        country: "France",
        duration: "15 min",
        synopsis: "Un court-métrage sur Mars.",
        youtubeId: "dQw4w9WgXcQ",
        voteDecision: "validate",
        voteComment: "Super film !",
      },
      {
        id: "2",
        title: "Rêves rouges",
        country: "Canada",
        duration: "12 min",
        synopsis: "Exploration des rêves sur Mars.",
        youtubeId: null,
      },
    ],
  });
});

// GET /api/films/:id : détails d'un film
router.get("/films/:id", ensureAuthenticated, async (req, res) => {
  // TODO: récupérer le film par ID (et vérifier l'accès du jury)
  const { id } = req.params;
  // Exemple statique :
  res.json({
    id,
    title: id === "1" ? "Mars, la conquête" : "Rêves rouges",
    country: id === "1" ? "France" : "Canada",
    duration: id === "1" ? "15 min" : "12 min",
    synopsis: id === "1"
      ? "Un court-métrage sur Mars."
      : "Exploration des rêves sur Mars.",
    youtubeId: id === "1" ? "dQw4w9WgXcQ" : null,
    voteDecision: id === "1" ? "validate" : undefined,
    voteComment: id === "1" ? "Super film !" : undefined,
  });
});

// POST /api/vote : soumettre un vote/commentaire
router.post("/vote", ensureAuthenticated, async (req, res) => {
  const { filmId, decision, comment } = req.body;
  // TODO: enregistrer le vote/commentaire en base pour ce jury
  // Exemple :
  res.json({ ok: true, filmId, decision, comment });
});

// GET /api/jury/me : infos du jury connecté
router.get("/jury/me", ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

export default router;
