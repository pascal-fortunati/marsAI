import {
  assignSubmissionsToJuryBulk,
  assignSubmissionToJury,
  getAdminSubmissionAssetPayload,
  listAdminSubmissions,
  publishSubmission,
  sendSubmissionStatusEmail,
  setSubmissionBadge,
  setSubmissionYoutubePrivate,
  setSubmissionStatus,
} from "../services/adminSubmissionsService.js";
import fs from "node:fs";

// Récupère la liste des soumissions pour l'admin
export async function getAdminSubmissions(req, res, next) {
  try {
    const payload = await listAdminSubmissions();
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Met à jour le statut d'une soumission pour l'admin
export async function putSubmissionStatus(req, res, next) {
  try {
    const submissionId = req.params.id;
    const status = req.body?.status;
    const comment =
      typeof req.body?.comment === "string" ? req.body.comment : "";

    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }

    if (
      !status ||
      !["pending", "validated", "refused", "review", "selected"].includes(
        status,
      )
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const payload = await setSubmissionStatus({
      adminUserId: req.user.userId,
      submissionId,
      status,
      comment,
    });

    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Met à jour le badge d'une soumission pour l'admin
export async function postSubmissionBadge(req, res, next) {
  try {
    const submissionId = req.params.id;
    const badge = req.body?.badge ?? null;
    const prize = req.body?.prize ?? null;

    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }

    if (badge !== null && !["grand_prix", "prix_jury"].includes(badge)) {
      return res.status(400).json({ error: "Invalid badge" });
    }

    if (prize !== null && typeof prize !== "string") {
      return res.status(400).json({ error: "Invalid prize" });
    }

    const payload = await setSubmissionBadge({
      adminUserId: req.user.userId,
      submissionId,
      badge,
      prize,
    });

    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Publie une soumission pour l'admin
export async function postSubmissionPublish(req, res, next) {
  try {
    const submissionId = req.params.id;
    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }

    const payload = await publishSubmission({ submissionId });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function postSubmissionYoutubePrivate(req, res, next) {
  try {
    const submissionId = req.params.id;
    const youtubePrivateId = req.body?.youtubePrivateId;
    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }
    if (!youtubePrivateId || typeof youtubePrivateId !== "string") {
      return res.status(400).json({ error: "Invalid youtubePrivateId" });
    }
    const payload = await setSubmissionYoutubePrivate({
      submissionId,
      youtubePrivateId,
    });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Assigne un jury à une soumission pour l'admin
export async function postSubmissionAssignJury(req, res, next) {
  try {
    const submissionId = req.params.id;
    const body = req.body || {};

    const juryUserIds = Array.isArray(body.juryUserIds)
      ? body.juryUserIds
      : body.juryUserId !== undefined
        ? [body.juryUserId]
        : [];

    const payload = await assignSubmissionToJury({ submissionId, juryUserIds });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Envoie un email de statut à une soumission pour l'admin
export async function postSubmissionSendEmail(req, res, next) {
  try {
    const submissionId = req.params.id;
    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }
    const payload = await sendSubmissionStatusEmail({ submissionId });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Assigne un jury à plusieurs soumissions pour l'admin
export async function postSubmissionsAssignJuryBulk(req, res, next) {
  try {
    const body = req.body || {};
    const submissionIds = Array.isArray(body.submissionIds)
      ? body.submissionIds
      : [];
    const juryUserIds = Array.isArray(body.juryUserIds) ? body.juryUserIds : [];
    const payload = await assignSubmissionsToJuryBulk({
      submissionIds,
      juryUserIds,
    });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function getAdminSubmissionAsset(req, res, next) {
  try {
    const submissionId = req.params.id;
    const assetType = req.params.assetType;
    const payload = await getAdminSubmissionAssetPayload({
      submissionId,
      assetType,
    });

    if (payload.kind === "file") {
      if (!fs.existsSync(payload.path)) {
        return res.status(404).json({ error: "Fichier introuvable" });
      }
      if (payload.contentType) {
        res.setHeader("Content-Type", payload.contentType);
      }
      return res.sendFile(payload.path);
    }

    if (payload.contentType) {
      res.setHeader("Content-Type", payload.contentType);
    }
    return payload.stream.pipe(res);
  } catch (err) {
    next(err);
  }
}
