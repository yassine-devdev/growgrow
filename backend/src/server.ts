import app from "./app";
import config from "./config";
import logger from "./utils/logger";
import { cacheService } from "./services/cache.service";

const startServer = async (): Promise<void> => {
  try {
    await cacheService.connect();
    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to start server:", {
      message: err.message,
      stack: err.stack,
    });
    // Graceful shutdown if initialization fails
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
// FIX: Cast process to `any` to bypass TS error when types are misconfigured.
process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  try {
    await cacheService.disconnect();
  } catch (err) {
    const derr = err instanceof Error ? err : new Error(String(err));
    logger.error("Error during cache disconnect on shutdown", {
      message: derr.message,
    });
  }
  // eslint-disable-next-line no-process-exit
  process.exit(0);
});
