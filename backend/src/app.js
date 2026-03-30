import express from "express";
import cors from "cors";

import session from "express-session";
import passport from "./auth/passport.js";

const app = express();

app.use(cors());
app.use(express.json());

// Configuration de la session (clé secrète à personnaliser)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // mettre true en prod avec HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

import authRoutes from "./auth/routes.js";
app.use("/api/auth", authRoutes);

import juryRoutes from "../jury/jury.js";
app.use("/api", juryRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "marsAI-backend" });
});

export { app };