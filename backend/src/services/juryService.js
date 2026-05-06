import { listAssignedSubmissionsForJuryUser } from "../models/juryAssignmentsModel.js";
import { insertJuryVoteOnce, listLatestVotesForJuryUser } from "../models/juryVotesModel.js";
import { formatDuration } from "../utils/coerce.js";
import { safeJsonArray } from "../utils/json.js";

// Service pour obtenir les soumissions assignées à un jury utilisateur
export async function getJurySubmissions({ juryUserId }) {
  const rows = await listAssignedSubmissionsForJuryUser(juryUserId);
  const ids = rows.map((r) => r.id);

  const voteRows = await listLatestVotesForJuryUser({ juryUserId, submissionIds: ids });
  const voteMap = new Map(voteRows.map((r) => [r.submission_id, { action: r.action, comment: r.comment || "" }]));

  const items = rows.map((r) => {
    const vote = voteMap.get(r.id) || null;
    const youtubeId = r.youtube_private_id || r.youtube_public_id || null;
    return {
      id: r.id,
      title: r.title,
      country: r.country,
      duration: formatDuration(r.duration_seconds),
      synopsis: r.synopsis,
      aiTools: safeJsonArray(r.ai_tools),
      youtubeId,
      vote: vote ? vote.action : null,
      comment: vote ? vote.comment : "",
      status: vote ? "voted" : "pending",
    };
  });

  return { items };
}

// Service pour soumettre un vote de jury pour une soumission
export async function castJuryVote({ juryUserId, submissionId, action, comment }) {
  if (action === "refuse" && !comment.trim()) {
    const err = new Error("Comment required for refusal");
    err.status = 400;
    throw err;
  }

  const result = await insertJuryVoteOnce({ juryUserId, submissionId, action, comment });
  if (!result.inserted) {
    const err = new Error("Vote already submitted");
    err.status = 409;
    throw err;
  }
  return { ok: true };
}