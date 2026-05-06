import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAdminJuryUsers } from "../controllers/adminJuryController.js";

// Route pour récupérer la liste des utilisateurs du jury admin
export const adminJuryRouter = Router();

// Route GET pour récupérer la liste des utilisateurs du jury admin
adminJuryRouter.get("/admin/jury-users", requireAuth(["admin", "moderator"]), getAdminJuryUsers);