import cors from "cors";
import express from "express";
import helmet from "helmet";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "WorkProof Global API is running.",
    service: "workproof-api",
    timestamp: new Date().toISOString(),
  });
});

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found.",
  });
});
