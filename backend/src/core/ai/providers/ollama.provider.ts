import { IAIProvider } from "./provider.interface";
import logger from "../../../utils/logger";

// Default configuration for the Ollama provider
const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const DEFAULT_MODEL = "llama3"; // A common, powerful default model

/**
 * An AI provider that communicates with a local Ollama instance.
 * It handles streaming responses from the Ollama REST API.
 */
export class OllamaProvider implements IAIProvider {
  constructor() {
    logger.info("OllamaProvider initialized.");
  }

  /**
   * Generates a streaming response from the configured Ollama model.
   * @param prompt - The input prompt to send to the model.
   * @returns A ReadableStream that yields string chunks of the AI's response.
   */
  async generateStream(prompt: string): Promise<ReadableStream<string>> {
    logger.info(
      `[OllamaProvider] Generating stream with model: ${DEFAULT_MODEL}`
    );

    // Ollama streams back newline-delimited JSON objects. We need to parse these
    // and extract the 'response' text from each object. A TransformStream is perfect for this.
    const transformStream = new TransformStream<Uint8Array, string>({
      transform(chunk, controller) {
        const textDecoder = new TextDecoder();
        const jsonObjectsStr = textDecoder.decode(chunk);
        const jsonStrs = jsonObjectsStr
          .split("\n")
          .filter((s) => s.trim() !== "");

        for (const jsonStr of jsonStrs) {
          try {
            const ollamaChunk = JSON.parse(jsonStr);
            // Enqueue the text part of the response
            if (ollamaChunk.response) {
              controller.enqueue(ollamaChunk.response);
            }
            // If Ollama signals it's done, we can close our stream
            if (ollamaChunk.done) {
              controller.terminate();
            }
          } catch (error) {
            logger.error(
              `[OllamaProvider] Error parsing stream chunk: ${jsonStr}`,
              {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
              }
            );
          }
        }
      },
    });

    // We perform the fetch request in an async IIFE and pipe its response body
    // into our transform stream. This allows us to return the readable side of the
    // transform stream immediately.
    (async () => {
      try {
        const response = await fetch(OLLAMA_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            prompt: prompt,
            stream: true, // This is crucial for getting a streaming response
          }),
        });

        if (!response.ok || !response.body) {
          const errorBody = await response.text();
          throw new Error(
            `Ollama API error (${response.status}): ${errorBody}`
          );
        }

        // Pipe the raw response from Ollama into our transformer's writable side
        await response.body.pipeTo(transformStream.writable);
      } catch (error) {
        logger.error("[OllamaProvider] Fetch or pipe error:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Abort the stream if the fetch fails, signaling an error to the consumer.
        await transformStream.writable.getWriter().abort(error);
      }
    })();

    // Return the readable side of the stream to the gateway service
    return transformStream.readable;
  }
}
