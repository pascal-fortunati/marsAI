import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

// Documentation Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Routeurs
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import juryRouter from "./routes/jury.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
  })
);
app.use(express.json());

// Definition Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "marsAI API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// enregistre les routeurs
app.use(healthRouter);
app.use(authRouter);
app.use(juryRouter);
app.use(adminRouter);

app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.message || "Internal server error";
  res.status(status).json({ error: message });
});

export { app };
