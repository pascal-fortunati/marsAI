import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

function getBearerToken(req) {
  const raw = req.headers.authorization;
  if (!raw || typeof raw !== "string") return null;
  if (!raw.toLowerCase().startsWith("bearer ")) return null;
  return raw.slice(7).trim();
}

export function requireAuth(req, _res, next) {
  const token = getBearerToken(req);
  if (!token) {
    const err = new Error("Missing bearer token");
    err.status = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.auth = payload;
    return next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    return next(err);
  }
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
    return next();
  };
}
