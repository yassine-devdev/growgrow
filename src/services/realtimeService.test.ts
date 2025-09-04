import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { realtimeService } from './realtimeService';

// Create a detailed, reusable mock instance
const mockWebSocketInstance = {
    onopen: jest.fn(),
    onmessage: jest.fn(),
    onclose: jest.fn(),
    onerror: jest.fn(),
    close: jest.fn(),
    readyState: 0, // CONNECTING
};

// Mock the WebSocket globally
// @ts-ignore - This is a standard way to mock globals in Jest
global.WebSocket = jest.fn(() => mockWebSocketInstance);

// Cast WebSocket to 'unknown' before casting to jest.Mock to resolve a strict type incompatibility error.
const mockedWebSocket = WebSocket as unknown as jest.Mock;

describe('realtimeService', () => {
    beforeEach(() => {
        // Clear all mock history and reset state before each test
        mockedWebSocket.mockClear();
        Object.values(mockWebSocketInstance).forEach(mockFn => {
            if (typeof mockFn === 'function') {
                mockFn.mockClear();
            }
        });
        mockWebSocketInstance.readyState = 0;
    });

    it('should initialize a WebSocket connection', () => {
        realtimeService.init();
        expect(mockedWebSocket).toHaveBeenCalledWith('ws://localhost:3001');
    });

    it('should not create a new WebSocket if one is already connecting or open', () => {
        realtimeService.init();
        // Simulate already open socket
        mockWebSocketInstance.readyState = 1; // OPEN
        
        realtimeService.init();
        expect(mockedWebSocket).toHaveBeenCalledTimes(1);
    });
    
    it('should close the existing socket connection when stop() is called', () => {
        realtimeService.init();
        realtimeService.stop();
        expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });
    
    it('should subscribe a listener and broadcast a message', () => {
        const listener = jest.fn();
        const channel = 'notifications';
        const data = { title: 'New Grade' };
        
        realtimeService.init();
        
        realtimeService.subscribe(channel, listener);

        // Simulate receiving a message from the WebSocket server
        const messageEvent = { data: JSON.stringify({ channel, data }) };
        mockWebSocketInstance.onmessage(messageEvent);

        expect(listener).toHaveBeenCalledWith(data);
    });

    it('should unsubscribe a listener', () => {
        const listener = jest.fn();
        const channel = 'notifications';
        
        realtimeService.init();

        realtimeService.subscribe(channel, listener);
        realtimeService.unsubscribe(channel, listener);

        const messageEvent = { data: JSON.stringify({ channel, data: {} }) };
        mockWebSocketInstance.onmessage(messageEvent);

        expect(listener).not.toHaveBeenCalled();
    });
});