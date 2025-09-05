import { createClient } from "redis";
import config from "../config";
import logger from "../utils/logger";

type RedisClientType = ReturnType<typeof createClient>;

class CacheService {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: config.redisUrl,
    });

    this.client.on("error", (err) => logger.error("Redis Client Error", err));
    this.client.on("connect", () => logger.info("Connecting to Redis..."));
    this.client.on("ready", () => {
      this.isConnected = true;
      logger.info("Redis client connected");
    });
    this.client.on("end", () => {
      this.isConnected = false;
      logger.info("Redis client disconnected");
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected && !this.client.isReady) {
      // Attempt to connect but don't let Redis unavailability block the server start.
      // Use a short timeout and swallow errors so dev can run without Redis.
      const timeoutMs = 2000;
      try {
        await Promise.race([
          this.client.connect(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Redis connection timeout")),
              timeoutMs
            )
          ),
        ]);
      } catch (error) {
        logger.error("Redis connect failed (continuing without redis):", {
          error: (error as Error).message,
        });
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error("Redis GET error:", { error });
      return null;
    }
  }

  async set(
    key: string,
    value: string,
    ttlSeconds: number = 3600
  ): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.set(key, value, {
        EX: ttlSeconds,
      });
    } catch (error) {
      logger.error("Redis SET error:", { error });
    }
  }
}

export const cacheService = new CacheService();
