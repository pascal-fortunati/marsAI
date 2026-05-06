import { listJuryUsers } from "../services/adminJuryService.js";

// Récupère la liste des utilisateurs jury pour l'admin
export async function getAdminJuryUsers(req, res, next) {
  try {
    const payload = await listJuryUsers({ limit: req.query.limit });
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}