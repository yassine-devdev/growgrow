/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { apiClient, apiStream, ApiError } from './apiClient';

// Mock native fetch
const mockFetch = jest.fn();
// @ts-ignore
global.fetch = mockFetch;

describe('apiClient', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should make a GET request with correct default options', async () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ data: 'success' }),
        }));

        const result = await apiClient('/test');

        expect(mockFetch).toHaveBeenCalledWith('/api/test', {
            method: 'GET',
            headers: expect.any(Headers),
            credentials: 'include',
        });
        // FIX: Safely access headers from the potentially undefined options object.
        const callOptions = mockFetch.mock.calls[0][1] as RequestInit | undefined;
        const headers = new Headers(callOptions?.headers);
        expect(headers.get('Content-Type')).toBe('application/json');
        expect(result).toEqual({ data: 'success' });
    });

    it('should make a POST request with body and correct headers', async () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: 1 }),
        }));
        
        const body = { name: 'test' };
        await apiClient('/test', { method: 'POST', body: JSON.stringify(body) });

        expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
        }));
    });

    it('should not set Content-Type for FormData', async () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true }),
        }));
        
        const formData = new FormData();
        formData.append('file', new Blob());

        await apiClient('/upload', { method: 'POST', body: formData });
        // FIX: Safely access headers from the potentially undefined options object.
        const callOptions = mockFetch.mock.calls[0][1] as RequestInit | undefined;
        const headers = new Headers(callOptions?.headers);
        expect(headers.has('Content-Type')).toBe(false);
    });

    it('should throw ApiError on non-ok response with a JSON body', async () => {
        const errorBody = { message: 'Not Found' };
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.resolve(errorBody),
        }));
        
        await expect(apiClient('/not-found')).rejects.toMatchObject({
            status: 404,
            body: errorBody,
            message: 'Not Found'
        });
    });

    it('should throw ApiError on non-ok response with a non-JSON body', async () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.reject('Invalid JSON'),
        }));
        
        await expect(apiClient('/server-error')).rejects.toMatchObject({
            status: 500,
            message: 'HTTP Error: Internal Server Error'
        });
    });

    it('should handle empty 204 No Content response', async () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            status: 204,
            json: () => Promise.reject(new Error('Should not be called')),
        }));
        
        const result = await apiClient('/delete', { method: 'DELETE' });
        expect(result).toBeNull();
    });
});

describe('apiStream', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should return a readable stream on successful response', async () => {
        const mockStream = new ReadableStream();
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            body: mockStream,
        }));

        const result = await apiStream('/stream');
        expect(result).toBe(mockStream);
        expect(mockFetch).toHaveBeenCalledWith('/api/stream', expect.objectContaining({
            credentials: 'include',
        }));
    });
    
    it('should throw ApiError on non-ok streaming response', async () => {
        const errorBody = { message: 'Stream failed' };
        mockFetch.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 500,
            body: null,
            json: () => Promise.resolve(errorBody),
        }));

        await expect(apiStream('/stream-fail')).rejects.toThrow(ApiError);
    });
});