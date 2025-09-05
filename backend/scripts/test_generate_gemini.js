// Quick script to test text generation with configured Gemini/Google GenAI key
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

    console.log("Calling generateContent (timeout 20s)...");
    const genPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Write a single short sentence describing why tests are important for software projects.",
    });

    const resp = await Promise.race([
      genPromise,
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("Generation timeout after 20s")), 20000)
      ),
    ]);

    console.log(
      "Generate response text:",
      resp?.text ?? JSON.stringify(resp, null, 2)
    );
    process.exit(0);
  } catch (err) {
    console.error(
      "Generation test failed:",
      err && err.stack ? err.stack : err
    );
    process.exit(1);
  }
})();
