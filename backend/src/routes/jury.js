import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getAssignedSubmissions, postVote } from "../controllers/juryController.js";

// Route GET pour récupérer les soumissions assignées au jury
export const juryRouter = Router();

// Route GET pour récupérer les soumissions assignées au jury
juryRouter.get("/jury/submissions", requireAuth(["jury"]), getAssignedSubmissions);
// Route POST pour voter sur une soumission
juryRouter.post("/jury/vote/:id", requireAuth(["jury"]), postVote);