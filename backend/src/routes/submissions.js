import { Router } from "express";
import { postSubmission } from "../controllers/submissionsController.js";

// Route POST pour poster une soumission
export const submissionsRouter = Router();

// Route POST pour poster une soumission
submissionsRouter.post("/submissions", postSubmission);