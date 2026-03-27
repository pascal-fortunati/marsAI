import { castJuryVote, getJurySubmissions } from "../services/juryService.js";

// Récupère les soumissions assignées au jury
export async function getAssignedSubmissions(req, res, next) {
  try {
    const juryUserId = req.user.userId;
    const payload = await getJurySubmissions({ juryUserId });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// Enregistre un vote pour une soumission par le jury
export async function postVote(req, res, next) {
  try {
    const juryUserId = req.user.userId;
    const submissionId = req.params.id;

    const action = req.body?.action;
    const comment = typeof req.body?.comment === "string" ? req.body.comment : "";

    if (!submissionId || typeof submissionId !== "string") {
      return res.status(400).json({ error: "Invalid submission id" });
    }

    if (!action || !["validate", "refuse", "review"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const payload = await castJuryVote({ juryUserId, submissionId, action, comment });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}