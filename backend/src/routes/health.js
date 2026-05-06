import { Router } from "express";

// Route GET pour vérifier l'état de santé de l'application
export const healthRouter = Router();

// Route GET pour vérifier l'état de santé de l'application
healthRouter.get("/health", (req, res) => {
  res.json({ ok: true });
});