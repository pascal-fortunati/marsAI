import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  deleteAdminYoutubeConnection,
  deleteAdminPartnerLogos,
  getAdminYoutubeCallback,
  getAdminYoutubeConnect,
  getAdminYoutubeStatus,
  getAdminSiteSettings,
  postAdminPartnerLogos,
  putAdminPartnerLogos,
  putAdminSiteSettings,
} from "../controllers/adminSiteController.js";

// Route pour gérer les paramètres du site admin
export const adminSiteRouter = Router();

// Route GET pour récupérer les paramètres du site admin
adminSiteRouter.get("/admin/site", requireAuth(["admin", "moderator"]), getAdminSiteSettings);
// Route PUT pour mettre à jour les paramètres du site admin  
adminSiteRouter.put("/admin/site", requireAuth(["admin", "moderator"]), putAdminSiteSettings);
// Route POST pour ajouter des logos des partenaires
adminSiteRouter.post("/admin/partner-logos", requireAuth(["admin", "moderator"]), postAdminPartnerLogos);
// Route DELETE pour supprimer les logos des partenaires
adminSiteRouter.delete("/admin/partner-logos", requireAuth(["admin", "moderator"]), deleteAdminPartnerLogos);
// Route PUT pour modifier les métadonnées des logos partenaires
adminSiteRouter.put("/admin/partner-logos", requireAuth(["admin", "moderator"]), putAdminPartnerLogos);
// Route GET pour générer l'URL de connexion OAuth2 YouTube
adminSiteRouter.get("/admin/youtube/connect", requireAuth(["admin", "moderator"]), getAdminYoutubeConnect);
// Route GET pour gérer le callback d'OAuth2 YouTube
adminSiteRouter.get("/admin/youtube/callback", getAdminYoutubeCallback);
// Route GET pour vérifier le statut de la connexion YouTube
adminSiteRouter.get("/admin/youtube/status", requireAuth(["admin", "moderator"]), getAdminYoutubeStatus);
// Route DELETE pour supprimer la connexion YouTube
adminSiteRouter.delete("/admin/youtube/connection", requireAuth(["admin", "moderator"]), deleteAdminYoutubeConnection);
