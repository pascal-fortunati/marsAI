import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getJuryFilms, postVote } from "../controllers/juryController.js";

const router = Router();

router.use(requireAuth);

router.get("/films", getJuryFilms);

router.post("/vote", postVote);

export default router;