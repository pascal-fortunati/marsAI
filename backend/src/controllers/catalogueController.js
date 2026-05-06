import fs from "node:fs";
import { getCataloguePage, getCataloguePosterPayload } from "../services/catalogueService.js";

// Récupère la page de catalogue
export async function getCatalogue(req, res, next) {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const payload = await getCataloguePage({ page, pageSize });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function getCataloguePoster(req, res, next) {
  try {
    const submissionId = req.params.id;
    const payload = await getCataloguePosterPayload({ submissionId });

    if (payload.kind === "file") {
      if (!fs.existsSync(payload.path)) {
        return res.status(404).json({ error: "Poster introuvable" });
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
