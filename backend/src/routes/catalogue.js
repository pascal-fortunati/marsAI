import { Router } from "express";
import { getCatalogue, getCataloguePoster } from "../controllers/catalogueController.js";

// Route GET pour récupérer le catalogue
export const catalogueRouter = Router();

// Route GET pour récupérer le catalogue
catalogueRouter.get("/catalogue", getCatalogue);
catalogueRouter.get("/catalogue/:id/poster", getCataloguePoster);
