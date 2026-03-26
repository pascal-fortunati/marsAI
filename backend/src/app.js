import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import submissionRouter from "./routes/submission.js";
import homeRouter from "./routes/home.js";
import catalogueRouter from "./routes/catalogue.js";
import uploadRouter from "./routes/upload.js";
import juryRouter from "./routes/jury.js";
import adminRouter from "./routes/admin.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
app.use("/api/site/home", homeRouter);
app.use("/api/catalogue", catalogueRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/jury", juryRouter);
app.use("/api/admin", adminRouter);
app.use("/uploads", express.static(path.resolve(__dirname, "../upload")));

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
