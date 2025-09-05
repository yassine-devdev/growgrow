import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import config from "../../../config";
import { vectorService, Vector } from "./vector.service";
import logger from "../../../utils/logger";

// A simple text splitter
const splitTextIntoChunks = (
  text: string,
  chunkSize = 500,
  overlap = 50
): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
};

// Define all documents to be ingested into the vector store
// FIX: Replaced `__dirname` with `process.cwd()` to build a robust absolute path from the project root.
// Resolve docs relative to this file to avoid depending on process.cwd()
const DOC_PATHS = [
  path.resolve(__dirname, "../../../docs/ABOUT_GROW_YOUR_NEED.md"),
  path.resolve(__dirname, "../../../docs/FEATURES.md"),
];

export const initializeVectorStore = async (): Promise<void> => {
  if (vectorService.count() > 0) {
    logger.info("Vector store already initialized.");
    return;
  }

  logger.info("Initializing vector store from documents...", {
    paths: DOC_PATHS,
  });
  try {
    // Prefer provider-specific key (GEMINI_API_KEY) but fall back to generic API_KEY
    const apiKey = config.geminiApiKey || config.apiKey;
    if (!apiKey) {
      logger.info(
        "No Gemini/API key found in config — skipping vector ingestion."
      );
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    // model used for embeddings — may need adjustment depending on the provider/version
    const embeddingModel = "text-embedding-004";

    const allVectors: Vector[] = [];

    for (const docPath of DOC_PATHS) {
      logger.info(`Processing document: ${path.basename(docPath)}`);
      const documentText = await fs.readFile(docPath, "utf-8");
      const chunks = splitTextIntoChunks(documentText);

      for (const chunk of chunks) {
        let embedding: number[] = [];
        try {
          const response = await ai.models.embedContent({
            model: embeddingModel,
            contents: [chunk],
          });

          if (
            response &&
            Array.isArray(response.embeddings) &&
            response.embeddings[0] &&
            Array.isArray(response.embeddings[0].values)
          ) {
            embedding = response.embeddings[0].values as number[];
          } else {
            logger.info(
              "Embedding response missing values for a chunk; skipping this chunk.",
              {
                doc: path.basename(docPath),
              }
            );
          }
        } catch (embedErr) {
          const embedError =
            embedErr instanceof Error ? embedErr : new Error(String(embedErr));
          logger.error("Embedding call failed for a chunk:", {
            message: embedError.message,
            stack: embedError.stack,
          });
        }
        allVectors.push({
          content: chunk,
          embedding,
        });
      }
    }

    vectorService.addVectors(allVectors);
    logger.info(
      `Vector store initialized successfully with ${vectorService.count()} vectors.`
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to initialize vector store:", {
      message: err.message,
      stack: err.stack,
    });
    // In a real app, you might want to retry or exit if this fails
  }
};
