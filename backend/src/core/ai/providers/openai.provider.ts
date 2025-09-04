import { IAIProvider } from './provider.interface';
import logger from '../../../utils/logger';

/**
 * A provider that simulates a streaming response from an OpenAI model.
 * In a real application, this would use the `openai` SDK.
 */
export class OpenAIProvider implements IAIProvider {
    constructor() {
        logger.info('OpenAIProvider initialized.');
    }

    async generateStream(prompt: string): Promise<ReadableStream<string>> {
        logger.info('[OpenAIProvider] Generating stream for a code generation task.');
        const responseText = `Based on your request for code generation, here is a Python snippet using a structured and object-oriented approach:\n\n\`\`\`python\nclass DataProcessor:\n    def __init__(self, data):\n        self.data = data\n\n    def process(self):\n        # Implementation details...\n        print("Processing complete.")\n\`\`\``;
        
        let i = 0;
        return new ReadableStream({
            pull(controller) {
                if (i < responseText.length) {
                    const chunk = responseText.slice(i, i + 10);
                    controller.enqueue(chunk);
                    i += 10;
                } else {
                    controller.close();
                }
            },
        });
    }
}
