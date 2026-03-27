import { Router } from "express";
import { getPalmaresHandler } from "../controllers/palmaresController.js";

// Route GET pour récupérer le palmarès
export const palmaresRouter = Router();

// Route GET pour récupérer le palmarès
palmaresRouter.get("/palmares", getPalmaresHandler);