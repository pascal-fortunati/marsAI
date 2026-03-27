import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Vérifie si l'utilisateur est authentifié et a le rôle requis
export function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Non autorisé" });
      }

      const token = header.slice("Bearer ".length);
      const payload = jwt.verify(token, env.jwtSecret);

      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: "Interdit" });
      }

      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: "Non autorisé" });
    }
  };
}