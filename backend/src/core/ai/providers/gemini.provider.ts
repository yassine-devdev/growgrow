import { GoogleGenAI } from "@google/genai";
import config from "../../../config";
import { IAIProvider } from "./provider.interface";
import logger from "../../../utils/logger";

// Shape we expect from the GenAI streaming chunks. Keep it narrow and explicit.
type GenAIChunk = {
  text?: string;
  // keep only expected properties to avoid unsafe indexing
};

const toSerializable = (err: unknown): object => {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  }
  if (typeof err === "object" && err !== null) return err as object;
  return { value: String(err) };
};

export class GeminiProvider implements IAIProvider {
  private ai: GoogleGenAI;

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error(
        "Gemini API key is not configured. Set GEMINI_API_KEY in environment."
      );
    }
    this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async generateStream(prompt: string): Promise<ReadableStream<string>> {
    const transformStream = new TransformStream<GenAIChunk, string>({
      transform(
        chunk: GenAIChunk,
        controller: TransformStreamDefaultController<string>
      ) {
        if (chunk && typeof chunk.text === "string") {
          controller.enqueue(chunk.text);
        }
      },
    });

    (async () => {
      const writer = transformStream.writable.getWriter();
      try {
        const maybeIterable = await this.ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        // The SDK may return an async iterable or a different shape; guard at runtime.
        if (
          maybeIterable == null ||
          typeof (maybeIterable as AsyncIterable<GenAIChunk>)[
            Symbol.asyncIterator
          ] !== "function"
        ) {
          // Not iterable — log and finish gracefully
          logger.error(
            "Gemini.generateContentStream returned non-iterable response",
            { responseType: typeof maybeIterable }
          );
        } else {
          const result = maybeIterable as AsyncIterable<GenAIChunk>;
          for await (const chunk of result) {
            // Defensive runtime check to ensure chunk is shaped as expected
            if (
              chunk &&
              typeof chunk.text === "string" &&
              chunk.text.length > 0
            ) {
              // The writable side expects GenAIChunk (the transform handles extracting .text)
              await writer.write(chunk);
            }
          }
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error("Error in Gemini stream generation", {
          message: error.message,
          stack: error.stack,
        });
        try {
          // Abort the writable side with an Error instance
          void writer.abort(error);
        } catch (abortErr) {
          const aerr =
            abortErr instanceof Error ? abortErr : new Error(String(abortErr));
          logger.error("Writer abort failed", { message: aerr.message });
        }
      } finally {
        try {
          writer.close();
        } catch (closeErr) {
          const cerr =
            closeErr instanceof Error ? closeErr : new Error(String(closeErr));
          logger.error("Writer close failed", { message: cerr.message });
        }
      }
    })();

    return transformStream.readable;
  }
}
