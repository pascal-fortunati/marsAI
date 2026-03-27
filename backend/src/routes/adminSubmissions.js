import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getAdminSubmissionAsset,
  getAdminSubmissions,
  postSubmissionBadge,
  postSubmissionAssignJury,
  postSubmissionYoutubePrivate,
  postSubmissionSendEmail,
  postSubmissionsAssignJuryBulk,
  postSubmissionPublish,
  putSubmissionStatus,
} from "../controllers/adminSubmissionsController.js";

// Route pour gérer les soumissions admin
export const adminSubmissionsRouter = Router();

// Route GET pour récupérer les soumissions admin
adminSubmissionsRouter.get(
  "/admin/submissions",
  requireAuth(["admin", "moderator"]),
  getAdminSubmissions,
);
// Route PUT pour mettre à jour le statut d'une soumission admin
adminSubmissionsRouter.put(
  "/admin/submissions/:id/status",
  requireAuth(["admin", "moderator"]),
  putSubmissionStatus,
);
// Route POST pour ajouter un badge à une soumission admin
adminSubmissionsRouter.post(
  "/admin/submissions/:id/badge",
  requireAuth(["admin", "moderator"]),
  postSubmissionBadge,
);
// Route POST pour assigner un jury à une soumission admin
adminSubmissionsRouter.post(
  "/admin/submissions/:id/assign-jury",
  requireAuth(["admin", "moderator"]),
  postSubmissionAssignJury,
);
// Route POST pour assigner un jury à plusieurs soumissions admin
adminSubmissionsRouter.post(
  "/admin/submissions/assign-jury-bulk",
  requireAuth(["admin", "moderator"]),
  postSubmissionsAssignJuryBulk,
);
// Route POST pour publier une soumission admin
adminSubmissionsRouter.post(
  "/admin/submissions/:id/publish",
  requireAuth(["admin", "moderator"]),
  postSubmissionPublish,
);
// Route POST pour renseigner l'identifiant YouTube privé d'une soumission admin
adminSubmissionsRouter.post(
  "/admin/submissions/:id/youtube-private",
  requireAuth(["admin", "moderator"]),
  postSubmissionYoutubePrivate,
);
// Route POST pour envoyer un email à une soumission admin
adminSubmissionsRouter.post(
  "/admin/submissions/:id/send-email",
  requireAuth(["admin", "moderator"]),
  postSubmissionSendEmail,
);
adminSubmissionsRouter.get(
  "/admin/submissions/:id/assets/:assetType",
  requireAuth(["admin", "moderator"]),
  getAdminSubmissionAsset,
);
