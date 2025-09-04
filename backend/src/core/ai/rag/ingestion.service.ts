import fs from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import config from '../../../config';
import { vectorService, Vector } from './vector.service';
import logger from '../../../utils/logger';

// A simple text splitter
const splitTextIntoChunks = (text: string, chunkSize = 500, overlap = 50): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
};

// Define all documents to be ingested into the vector store
// FIX: Replaced `__dirname` with `process.cwd()` to build a robust absolute path from the project root.
const DOC_PATHS = [
    // FIX: Cast `process` to `any` to resolve TypeScript error 'Property 'cwd' does not exist on type 'Process''.
    path.join((process as any).cwd(), 'backend/src/docs/ABOUT_GROW_YOUR_NEED.md'),
    // FIX: Cast `process` to `any` to resolve TypeScript error 'Property 'cwd' does not exist on type 'Process''.
    path.join((process as any).cwd(), 'backend/src/docs/FEATURES.md'),
];

export const initializeVectorStore = async (): Promise<void> => {
    if (vectorService.count() > 0) {
        logger.info('Vector store already initialized.');
        return;
    }

    logger.info('Initializing vector store from documents...', { paths: DOC_PATHS });
    try {
        const ai = new GoogleGenAI({ apiKey: config.apiKey });
        // Although the guidelines may focus on generative models,
        // text-embedding-004 is the correct model for this task.
        const embeddingModel = "text-embedding-004";

        const allVectors: Vector[] = [];

        for (const docPath of DOC_PATHS) {
            logger.info(`Processing document: ${path.basename(docPath)}`);
            const documentText = await fs.readFile(docPath, 'utf-8');
            const chunks = splitTextIntoChunks(documentText);

            for (const chunk of chunks) {
                const response = await ai.models.embedContent({ model: embeddingModel, contents: [chunk] });
                allVectors.push({
                    content: chunk,
                    embedding: response.embeddings[0].values,
                });
            }
        }

        vectorService.addVectors(allVectors);
        logger.info(`Vector store initialized successfully with ${vectorService.count()} vectors.`);

    } catch (error) {
        logger.error('Failed to initialize vector store:', error as Error);
        // In a real app, you might want to retry or exit if this fails
    }
};