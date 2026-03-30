import express from "express";
import passport from "../auth/passport.js";

const router = express.Router();


// Démarre le flow Google OAuth
router.get("/login", passport.authenticate("google", { scope: ["profile", "email"] }));


// Callback Google OAuth
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failed",
    session: true,
  }),
  (req, res) => {
    // Redirige ou répond après succès
    res.json({ success: true, user: req.user });
  }
);

// Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

// Échec d'auth
router.get("/failed", (_req, res) => {
  res.status(401).json({ success: false, message: "Échec de l'authentification" });
});

export default router;
