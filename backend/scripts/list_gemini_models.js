// List available Gemini/Google GenAI models (best-effort across SDK versions)
(async () => {
  try {
    const dotenv = require("dotenv");
    const path = require("path");
    dotenv.config({ path: path.resolve(__dirname, "../.env") });

    const key =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.API_KEY;
    if (!key) {
      console.error(
        "No GEMINI_API_KEY / GOOGLE_GENAI_API_KEY / API_KEY found in backend/.env"
      );
      process.exit(2);
    }

    console.log("Using key from env (first 8 chars):", key.slice(0, 8) + "...");

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: key });

    console.log(
      "Trying to list models via ai.models.list() or ai.models.listModels()..."
    );
    if (typeof ai.models.list === "function") {
      const resp = await ai.models.list();
      console.log(
        "Models list response:",
        JSON.stringify(resp, null, 2).slice(0, 2000)
      );
      process.exit(0);
    }
    if (typeof ai.models.listModels === "function") {
      const resp = await ai.models.listModels();
      console.log(
        "Models listModels response:",
        JSON.stringify(resp, null, 2).slice(0, 2000)
      );
      process.exit(0);
    }

    console.error(
      "No list method available on ai.models; SDK may require different call."
    );
    process.exit(3);
  } catch (err) {
    console.error("List models failed:", err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
