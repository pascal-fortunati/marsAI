import { Router } from "express";
import { getCatalogue, getFilmById } from "../controllers/catalogueController.js";

const router = Router();

// GET /api/catalogue
router.get("/", getCatalogue);

// GET /api/catalogue/:id
router.get("/:id", getFilmById);

export default router;