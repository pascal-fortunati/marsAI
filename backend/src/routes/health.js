import express from "express";
const router = express.Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: verification de sante
 *     responses:
 *       200:
 *         description: etat du service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 service:
 *                   type: string
 */
router.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "marsAI-backend" });
});

export default router;
