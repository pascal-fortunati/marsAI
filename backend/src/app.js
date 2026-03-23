import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import submissionRouter from "./routes/submission.js";

const app = express();

const defaultDevOrigins = [
  "http://localhost:4001",
  "http://localhost:4002",
  "http://127.0.0.1:4001",
  "http://127.0.0.1:4002",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = new Set([...defaultDevOrigins, ...env.corsOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowedDevLocalhost =
        env.nodeEnv === "development" &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin);

      if (isAllowedDevLocalhost || allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
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
