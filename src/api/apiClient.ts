import { useAppStore } from '@/store/useAppStore';

// In a real app, this would come from an environment variable
const API_BASE_URL = '/api';

/**
 * Custom error class for API responses.
 * Contains the HTTP status and the response body for richer error handling.
 */
export class ApiError extends Error {
    status: number;
    body: any;

    constructor(message: string, status: number, body: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}


/**
 * A wrapper around the Fetch API to standardize API calls.
 * It automatically adds the base URL and content-type headers.
 * It now uses `credentials: 'include'` to automatically send HttpOnly cookies.
 * It also handles response validation and throws a custom ApiError.
 *
 * @param {string} endpoint - The API endpoint to call (e.g., '/users').
 * @param {RequestInit} [options] - Optional fetch options (method, body, etc.).
 * @returns {Promise<T>} A promise that resolves to the JSON response.
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    
    // Don't set Content-Type for FormData, as the browser does it best.
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET', // Default method
        ...options,
        headers,
        credentials: 'include', // This is crucial for HttpOnly cookies
    });

    if (!response.ok) {
        // Try to parse the error body as JSON, but fall back to a generic message.
        const errorBody = await response.json().catch(() => ({ message: `HTTP Error: ${response.statusText}` }));
        throw new ApiError(
            errorBody.message || `API request failed with status ${response.status}`,
            response.status,
            errorBody
        );
    }

    // Handle cases where the response might be empty (e.g., DELETE 204 No Content)
    if (response.status === 204) {
        return Promise.resolve(null as unknown as T);
    }

    return response.json() as Promise<T>;
}

/**
 * A specific fetch wrapper for handling streaming responses, like from the AI concierge.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {RequestInit} [options] - Optional fetch options.
 * @returns {Promise<ReadableStream<Uint8Array>>} A promise that resolves to a readable stream.
 */
export async function apiStream(endpoint: string, options: RequestInit = {}): Promise<ReadableStream<Uint8Array>> {
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Also send cookies for streaming requests
    });

    if (!response.ok || !response.body) {
         const errorBody = await response.json().catch(() => ({ message: `HTTP Error: ${response.statusText}` }));
        throw new ApiError(
            errorBody.message || `API stream failed with status ${response.status}`,
            response.status,
            errorBody
        );
    }

    return response.body;
}