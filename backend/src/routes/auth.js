import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const googleClient = new OAuth2Client(env.googleClientId || undefined);

function issueAppToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

function toAuthResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function findOrCreateUserFromGoogle(payload) {
  const googleSubId = payload.sub;
  const email = payload.email;
  const name = payload.name || email;

  const [bySubRows] = await db.execute(
    "SELECT id, email, name, role, google_sub_id FROM users WHERE google_sub_id = ? LIMIT 1",
    [googleSubId]
  );
  if (bySubRows.length > 0) {
    const existing = bySubRows[0];
    await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      existing.id,
    ]);
    return {
      id: existing.id,
      email,
      name,
      role: existing.role,
    };
  }

  const [byEmailRows] = await db.execute(
    "SELECT id, email, name, role, google_sub_id FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  if (byEmailRows.length > 0) {
    const existing = byEmailRows[0];
    await db.execute(
      "UPDATE users SET google_sub_id = ?, name = ? WHERE id = ?",
      [googleSubId, name, existing.id]
    );
    return {
      id: existing.id,
      email,
      name,
      role: existing.role,
    };
  }

  const [insertResult] = await db.execute(
    "INSERT INTO users (google_sub_id, email, name, role) VALUES (?, ?, ?, 'jury')",
    [googleSubId, email, name]
  );

  return {
    id: insertResult.insertId,
    email,
    name,
    role: "jury",
  };
}

/**
 * @openapi
 * /api/auth/google:
 *   post:
 *     summary: Connexion avec un token ID Google
 */
router.post("/api/auth/google", async (req, res, next) => {
  try {
    if (!env.googleClientId) {
      return res.status(503).json({
        error: "Google OAuth is not configured on server",
      });
    }

    const credential = req.body?.credential;
    if (!credential || typeof credential !== "string") {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: "Invalid Google token payload" });
    }

    if (payload.email_verified === false) {
      return res.status(401).json({ error: "Google email is not verified" });
    }

    const user = await findOrCreateUserFromGoogle(payload);
    const token = issueAppToken(user);

    return res.json({ token, user: toAuthResponse(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/api/auth/me", requireAuth, async (req, res) => {
  res.json({
    user: {
      id: Number.parseInt(String(req.auth.sub), 10),
      email: req.auth.email,
      name: req.auth.name,
      role: req.auth.role,
    },
  });
});

router.post("/api/auth/demo", async (_req, res) => {
  const user = {
    id: 1,
    email: "demo-jury@marsai.local",
    name: "Demo Jury",
    role: "jury",
  };
  const token = issueAppToken(user);
  res.json({ token, user });
});

export default router;
