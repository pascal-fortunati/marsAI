import express from "express";
import cors from "cors";

// swagger & documentation
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// routes
import healthRouter from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json());

// swagger definition
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

// register routers
app.use(healthRouter);

export { app };
