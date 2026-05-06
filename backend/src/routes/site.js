import { Router } from "express";
import {
  getSiteEmailLogo,
  getSiteOptions,
  getSiteSettings,
} from "../controllers/siteController.js";

// Route GET pour récupérer les paramètres du site
export const siteRouter = Router();

// Route GET pour récupérer les paramètres du site
siteRouter.get("/site", getSiteSettings);
// Route GET pour récupérer les options du site
siteRouter.get("/site/options", getSiteOptions);
// Route GET pour récupérer le logo email
siteRouter.get("/site/email-logo", getSiteEmailLogo);
