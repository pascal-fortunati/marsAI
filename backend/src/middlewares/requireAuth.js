// Middleware de vérification token
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.slice(7); // Enlève "Bearer "

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = payload; // Ajoute les infos du token à la requête
        next();
    } catch {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
}