export function uploadFiles(req, res) {
    const files = req.files ?? {};
    const submissionId = req.uploadSubmissionId;

    if (!submissionId) {
        return res.status(500).json({ error: "Impossible de générer un identifiant de soumission." });
    }

    const url = (field) => files[field]?.[0]
        ? `/uploads/${submissionId}/${files[field][0].filename}`
        : null;

    return res.json({
        submission_id: submissionId,
        video_url: url("video"),
        poster_url: url("poster"),
        subtitles_url: url("subtitles"),
    });
}