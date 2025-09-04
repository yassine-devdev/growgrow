import { IAIProvider } from './provider.interface';
import logger from '../../../utils/logger';

/**
 * A provider that simulates a streaming response from an Anthropic Claude model.
 * In a real application, this would use the `@anthropic-ai/sdk`.
 */
export class AnthropicProvider implements IAIProvider {
    constructor() {
         logger.info('AnthropicProvider initialized.');
    }

    async generateStream(prompt: string): Promise<ReadableStream<string>> {
        logger.info('[AnthropicProvider] Generating stream for a high-quality analysis task.');
        const responseText = `Thinking through the data analysis task... The primary correlation appears to be between student engagement and final grades. However, a confounding variable might be the level of parental involvement. To provide a more robust conclusion, I would recommend segmenting the data further. Here are the key insights:\n1. ...`;
        
        let i = 0;
        return new ReadableStream({
            pull(controller) {
                if (i < responseText.length) {
                    const chunk = responseText.slice(i, i + 8); // Slower, more "thoughtful" stream
                    controller.enqueue(chunk);
                    i += 8;
                } else {
                    controller.close();
                }
            },
        });
    }
}
