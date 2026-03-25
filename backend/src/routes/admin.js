import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getAdminFilms, postDecision } from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth);

router.get("/films", getAdminFilms);
router.post("/decisions", postDecision);

export default router;