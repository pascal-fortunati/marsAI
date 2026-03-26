import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAdminFilms, postDecision } from "../controllers/adminControllerl.js";

const router = Router();
router.get("/films", getAdminFilms);
router.post("/decisions", requireAuth, postDecision);

export default router;