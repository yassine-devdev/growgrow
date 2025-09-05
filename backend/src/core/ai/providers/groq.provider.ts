import { IAIProvider } from "./provider.interface";
import logger from "../../../utils/logger";
import config from "../../../config";

/**
 * A provider that simulates a very fast, low-latency streaming response from Groq.
 * In a real application, this would use the `groq-sdk`.
 */
export class GroqProvider implements IAIProvider {
  constructor() {
    logger.info("GroqProvider initialized.");
    if (!config.groqApiKey) {
      throw new Error(
        "Groq API key not configured. Set GROQ_API_KEY in environment."
      );
    }
  }

  async generateStream(prompt: string): Promise<ReadableStream<string>> {
    logger.info("[GroqProvider] Generating ultra-low-latency stream for chat.");
    const responseText = `Of course! Here is a quick answer to your question. The capital of France is Paris. Let me know if you need anything else!`;

    let i = 0;
    return new ReadableStream({
      pull(controller) {
        if (i < responseText.length) {
          const chunk = responseText.slice(i, i + 25); // Faster chunks
          controller.enqueue(chunk);
          i += 25;
        } else {
          controller.close();
        }
      },
    });
  }
}
