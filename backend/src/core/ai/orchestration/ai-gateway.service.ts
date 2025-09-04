import { Role } from '../../../../../types';
import { modelRouter } from './model-router.service';
import { vectorService } from '../rag/vector.service';
import { GoogleGenAI } from '@google/genai';
import config from '../../../config';
import { cacheService } from '../../../services/cache.service';
import { createHash } from 'crypto';
import logger from '../../../utils/logger';

// Helper to convert a string to a ReadableStream of strings
const stringToStream = (str: string): ReadableStream<string> => {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(str);
            controller.close();
        },
    });
};


class AIGatewayService {
    public async generateResponseStream(prompt: string, userRole: Role): Promise<ReadableStream<string>> {
        // 1. Create a unique cache key from the prompt and role
        const hash = createHash('sha256').update(prompt).digest('hex');
        const cacheKey = `ai-response:${userRole}:${hash}`;

        // 2. Check cache first
        const cachedResponse = await cacheService.get(cacheKey);
        if (cachedResponse) {
            logger.info(`[CACHE HIT] for key: ${cacheKey}`);
            return stringToStream(cachedResponse);
        }
        
        logger.info(`[CACHE MISS] for key: ${cacheKey}`);

        // 3. On cache miss, proceed with the original RAG and model routing logic
        const ai = new GoogleGenAI({ apiKey: config.apiKey });
        const embeddingModel = "text-embedding-004"; 
        
        const embeddingResponse = await ai.models.embedContent({ model: embeddingModel, contents: [prompt] });
        const promptEmbedding = embeddingResponse.embeddings[0].values;
        
        const contextChunks = await vectorService.similaritySearch(promptEmbedding, 3);
        const context = contextChunks.map(c => c.content).join('\n\n---\n\n');

        const augmentedPrompt = `You are an AI assistant for the GROW YouR NEED Super App.
The user is a ${userRole}.
Answer the user's question based ONLY on the following context. If the context doesn't have the answer, say you don't have information on that topic.

Context:
${context}

User's Question:
${prompt}
`;
        // 4. Select a model using the enhanced router with specific criteria
        const provider = modelRouter.selectModel({ taskType: 'chat', intent: 'balanced' });
        const providerStream = await provider.generateStream(augmentedPrompt);
        
        // 5. Tee the stream to send one copy to the client and use the other for caching
        const [streamForClient, streamForCache] = providerStream.tee();

        // 6. Asynchronously read the second stream and cache the full response when complete
        (async () => {
            let fullText = '';
            const reader = streamForCache.getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                // The provider streams are already strings, so no decoding needed.
                fullText += value;
            }
            if (fullText) {
                logger.info(`[CACHE SET] for key: ${cacheKey}`);
                // Cache the full response for 1 hour
                await cacheService.set(cacheKey, fullText, 3600);
            }
        })().catch(err => logger.error('Error during stream caching:', err));

        // 7. Return the first stream immediately to the client
        return streamForClient;
    }
}

export const aiGatewayService = new AIGatewayService();