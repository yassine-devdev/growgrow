import { GoogleGenAI } from '@google/genai';
import config from '../../../config';
import { IAIProvider } from './provider.interface';
import logger from '../../../utils/logger';

export class GeminiProvider implements IAIProvider {
    private ai: GoogleGenAI;

    constructor() {
        if (!config.apiKey) {
            throw new Error("Gemini API key is not configured.");
        }
        this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    }

    async generateStream(prompt: string): Promise<ReadableStream<string>> {
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                if (chunk && typeof chunk.text === 'string') {
                    controller.enqueue(chunk.text);
                }
            },
        });

        (async () => {
            const writer = transformStream.writable.getWriter();
            try {
                const result = await this.ai.models.generateContentStream({
                    model: 'gemini-2.5-flash',
                    contents: prompt
                });

                for await (const chunk of result) {
                    writer.write(chunk);
                }
            } catch (error) {
                logger.error('Error in Gemini stream generation:', error);
                writer.abort(error);
            } finally {
                writer.close();
            }
        })();
        
        return transformStream.readable;
    }
}
