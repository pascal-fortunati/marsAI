import express from "express";
import { db } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/admin/users", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: rows });
  } catch (error) {
    next(error);
  }
});

export default router;
