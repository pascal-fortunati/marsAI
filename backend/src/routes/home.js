import { Router } from "express";
import { getHome } from "../controllers/homeController.js";

const router = Router();
// GET /api/home - Récupérer les données pour la page d'accueil
router.get("/", getHome);

export default router;