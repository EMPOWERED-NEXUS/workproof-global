import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env, isOriginAllowed } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/validate.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { csrfOriginGuard } from "./middleware/csrf.js";
import { swaggerSpec } from "./swagger.js";
import { checkDatabaseHealth } from "./lib/prisma.js";
import { asyncHandler } from "./middleware/validate.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_PROXY);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);
app.use(csrfOriginGuard);

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "WorkProof Global API is running.",
    service: "workproof-api",
    timestamp: new Date().toISOString(),
  });
});

app.get(
  "/api/v1/readiness",
  asyncHandler(async (_req, res) => {
    const ready = await checkDatabaseHealth();
    if (!ready) {
      res.status(503).json({
        success: false,
        message: "Service unavailable.",
        checks: { database: "unavailable" },
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Service ready.",
      checks: { database: "ok" },
    });
  }),
);

if (env.ENABLE_API_DOCS) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));
}

app.use("/api/v1", apiRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use(errorHandler);
