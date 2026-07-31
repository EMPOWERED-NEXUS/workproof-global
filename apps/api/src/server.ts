import { app } from "./app.js";
import { env } from "./config/env.js";
import { startEmailDispatcher, stopEmailDispatcher } from "./email/dispatcher.js";
import { disconnectDatabase } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(`WorkProof Global API running at http://localhost:${env.PORT}`);
  if (env.ENABLE_API_DOCS) {
    console.log(`API docs at http://localhost:${env.PORT}/api-docs`);
  }
  // Dispatcher starts after listen; temporary provider outages must not block boot.
  try {
    startEmailDispatcher();
  } catch (error) {
    console.error(
      "Email dispatcher failed to start.",
      error instanceof Error ? error.message : "unknown",
    );
  }
});

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received. Closing server.`);

  const forceTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
  forceTimer.unref();

  await stopEmailDispatcher();

  server.close(async () => {
    try {
      await disconnectDatabase();
      console.log("Server closed successfully.");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown.", error instanceof Error ? error.message : "unknown");
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
