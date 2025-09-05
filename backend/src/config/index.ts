import * as dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  apiKey: process.env.API_KEY || "",
  geminiApiKey:
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || "",
  openRouterApiKey:
    process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || "",
  groqApiKey: process.env.GROQ_API_KEY || process.env.GROQ_KEY || "",
  jwt: {
    secret: process.env.JWT_SECRET || "supersecret",
    expiresIn: "1d",
  },
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  databaseUrl: process.env.DATABASE_URL || "",
};

if (!config.apiKey) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "WARNING: API_KEY is not set in the environment variables. AI features will not work."
  );
}
if (!config.databaseUrl) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "WARNING: DATABASE_URL is not set. Database features will not work."
  );
}

export default config;
