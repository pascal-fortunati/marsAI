import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import submissionRouter from "./routes/submission.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/submissions", submissionRouter);

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "marsAI backend API",
    health: "/api/health",
    submissions: "/api/submissions",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "marsAI-backend" });
});

export { app };
