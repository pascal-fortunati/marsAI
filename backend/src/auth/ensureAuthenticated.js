// Middleware pour protéger les routes du jury
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Non authentifié" });
}
