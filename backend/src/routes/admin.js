import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAdminFilms, getAdminJuries, postAssignJury, postDecision } from "../controllers/adminControllerl.js";
import {
    getSettings,
    postSettings,
    postInvalidateCache,
} from "../controllers/adminSettingsController.js";

const router = Router();

// Films
router.get("/films", getAdminFilms);
router.post("/decisions", postDecision);
router.get("/juries", getAdminJuries);
router.post("/jury-assignments", postAssignJury);

// Settings (onglet Site)
router.get("/settings", getSettings);
router.post("/settings", postSettings);
router.post("/settings/invalidate-cache", postInvalidateCache);

export default router;