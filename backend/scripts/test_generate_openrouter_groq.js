// Test local simulated providers: OpenRouterProvider and GroqProvider
(async () => {
  // Allow requiring TypeScript source files from this script
  try {
    require("ts-node").register({ transpileOnly: true });
  } catch (e) {
    // ts-node may not be installed in PATH; fall back silently — script will fail with clearer error
  }
  try {
    const path = require("path");
    const dotenv = require("dotenv");
    dotenv.config({ path: path.resolve(__dirname, "../.env") });

    const {
      OpenRouterProvider,
    } = require("../src/core/ai/providers/openrouter.provider");
    const { GroqProvider } = require("../src/core/ai/providers/groq.provider");

    console.log("Initializing providers...");
    const or = new OpenRouterProvider();
    const g = new GroqProvider();

    console.log("Generating OpenRouter stream...");
    const orStream = await or.generateStream("Test prompt for OpenRouter");
    const reader = orStream.getReader();
    let orText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      orText += value;
    }
    console.log("[OpenRouter] combined text:", orText);

    console.log("Generating Groq stream...");
    const gStream = await g.generateStream("Test prompt for Groq");
    const gReader = gStream.getReader();
    let gText = "";
    while (true) {
      const { done, value } = await gReader.read();
      if (done) break;
      gText += value;
    }
    console.log("[Groq] combined text:", gText);

    process.exit(0);
  } catch (err) {
    console.error(
      "Provider stream test failed:",
      err && err.stack ? err.stack : err
    );
    process.exit(1);
  }
})();
