import { Router } from "express";
import { upload, withUploadSubmissionId } from "../middlewares/UploadMiddleware.js";
import { uploadFiles } from "../controllers/uploadController.js";

const router = Router();

// POST /api/upload - reçoit les fichiers uploadés et retourne leurs URL
router.post("/", withUploadSubmissionId, upload, uploadFiles);

export default router;