// Quick script to test embedding API with configured keys in backend/.env
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

    console.log("Calling embedContent...");
    const resp = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: ["hello world"],
    });
    console.log("Embed response:", JSON.stringify(resp, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Embedding test failed:", err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
