import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAuthMe, getGoogleAuth, getGoogleCallback, getLogout } from "../controllers/authController.js";

// Route pour gérer l'authentification
export const authRouter = Router();

// Route GET pour l'authentification Google
authRouter.get("/auth/google", getGoogleAuth);
// Route GET pour le callback d'authentification Google
authRouter.get("/auth/google/callback", getGoogleCallback);
// Route GET pour récupérer les informations de l'utilisateur authentifié
authRouter.get("/auth/me", requireAuth([]), getAuthMe);
// Route GET pour se déconnecter
authRouter.get("/auth/logout", getLogout);