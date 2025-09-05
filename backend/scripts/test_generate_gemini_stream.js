// Test Gemini streaming generation with timeout (20s)
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

    console.log("Calling generateContentStream (timeout 20s)...");
    const streamPromise = (async () => {
      const genStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents:
          "Provide a one-sentence summary of why code reviews are valuable.",
      });
      let text = "";
      for await (const chunk of genStream) {
        if (chunk?.text) text += chunk.text;
      }
      return text;
    })();

    const text = await Promise.race([
      streamPromise,
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("Stream timeout after 20s")), 20000)
      ),
    ]);

    console.log("Streamed text:", text);
    process.exit(0);
  } catch (err) {
    console.error(
      "Gemini stream test failed:",
      err && err.stack ? err.stack : err
    );
    process.exit(1);
  }
})();
