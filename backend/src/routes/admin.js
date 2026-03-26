import { Router } from "express";
import { getAdminFilms, getAdminJuries, postAssignJury, postDecision } from "../controllers/adminControllerl.js";

const router = Router();
router.get("/films", getAdminFilms);
router.get("/juries", getAdminJuries);
router.post("/decisions", postDecision);
router.post("/jury-assignments", postAssignJury);

export default router;