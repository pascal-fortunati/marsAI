// Déclare les routes liées aux soumissions publiques
import { Router } from "express";
import { submitFilm } from "../controllers/submissionController.js";

const router = Router();

// POST /api/submissions - Soumettre un film
router.post("/", submitFilm);

export default router;