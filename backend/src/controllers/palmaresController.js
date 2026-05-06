import { getPalmares } from "../services/palmaresService.js";

// Récupère le palmarès de la compétition
export async function getPalmaresHandler(_req, res, next) {
  try {
    const payload = await getPalmares();
    return res.json(payload);
  } catch (err) {
    next(err);
  }
}