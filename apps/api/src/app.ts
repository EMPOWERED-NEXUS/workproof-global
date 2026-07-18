import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/validate.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { swaggerSpec } from "./swagger.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "WorkProof Global API is running.",
    service: "workproof-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));

app.use("/api/v1", apiRouter);

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use(errorHandler);
