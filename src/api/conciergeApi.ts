import type { Role } from '@/types/index.ts';
import { apiStream, apiClient } from './apiClient';

/**
 * Interacts with the backend to get a streaming response for a given prompt.
 * The backend will proxy the request to the Gemini API securely.
 * This function now uses an async generator to stream response chunks.
 *
 * @param {string} prompt - The user's input prompt to send to the model.
 * @param {Role} userRole - The role of the user interacting with the AI.
 * @returns {AsyncGenerator<string>} An async generator that yields the cumulative response text as chunks are received.
 */
export async function* getAiStreamingResponse(
    prompt: string,
    userRole: Role
): AsyncGenerator<string> {
    const stream = await apiStream('/concierge/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt, userRole }),
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const chunkText = decoder.decode(value, { stream: true });
        fullText += chunkText;
        yield fullText; // Yield the cumulative text
    }
}


/**
 * Sends a prompt for a specific analysis task to a non-streaming AI endpoint.
 * @param prompt The detailed prompt for the analysis.
 * @returns A promise that resolves to an object containing the AI's text response.
 */
export const getAiAnalysis = async (prompt: string): Promise<{ text: string }> => {
    return apiClient('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });
};
