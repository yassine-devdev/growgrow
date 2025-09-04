import { IAIProvider } from './provider.interface';
import logger from '../../../utils/logger';

/**
 * A provider that simulates a streaming response from OpenRouter,
 * which can route to various underlying models. In a real application,
 * this would use the `openai` SDK in compatibility mode.
 */
export class OpenRouterProvider implements IAIProvider {
    constructor() {
        logger.info('OpenRouterProvider initialized.');
    }

    async generateStream(prompt: string): Promise<ReadableStream<string>> {
        logger.info('[OpenRouterProvider] Simulating stream from a routed model (e.g., Mistral).');
        
        const responseText = `As a large language model routed through OpenRouter, my analysis of your prompt suggests a multi-faceted approach. Here are the key points to consider:\n\n1.  **Core Issue:** The central problem revolves around data integrity.\n2.  **Proposed Solution:** Implementing a validation layer at the point of ingestion.\n3.  **Next Steps:** Draft a technical specification for the new service.`;
        
        let i = 0;
        return new ReadableStream({
            pull(controller) {
                // Simulate a moderately paced stream
                if (i < responseText.length) {
                    const chunk = responseText.slice(i, i + 12);
                    controller.enqueue(chunk);
                    i += 12;
                } else {
                    controller.close();
                }
            },
        });
    }
}
