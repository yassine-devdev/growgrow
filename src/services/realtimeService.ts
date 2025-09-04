import type { Notification } from '@/types/index.ts';

type ListenerCallback = (data: any) => void;
type Listeners = {
    [key: string]: ListenerCallback[];
};

class RealtimeService {
    private socket: WebSocket | null = null;
    private listeners: Listeners = {
        'notifications': [],
        'monitoring': [],
    };

    init() {
        if (this.socket && this.socket.readyState < 2) return; // Do not reconnect if already open or connecting

        // In a real app, this URL would come from an environment variable
        const wsUrl = `ws://${window.location.host.split(':')[0]}:3001`; // Assuming a local WebSocket server

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('Real-time service connected.');
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.channel && message.data) {
                    this.broadcast(message.channel, message.data);
                }
            } catch (error) {
                console.error('Failed to parse real-time message:', error);
            }
        };

        this.socket.onclose = () => {
            console.log('Real-time service disconnected. Attempting to reconnect...');
            // Simple exponential backoff reconnect logic
            setTimeout(() => this.init(), 3000);
        };

        this.socket.onerror = (error) => {
            console.error('Real-time service error:', error);
            this.socket?.close(); // This will trigger the onclose reconnect logic
        };
    }

    stop() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    subscribe(channel: string, callback: ListenerCallback) {
        if (!this.listeners[channel]) {
            this.listeners[channel] = [];
        }
        this.listeners[channel].push(callback);
    }

    unsubscribe(channel: string, callback: ListenerCallback) {
        if (this.listeners[channel]) {
            this.listeners[channel] = this.listeners[channel].filter(cb => cb !== callback);
        }
    }

    private broadcast(channel: string, data: any) {
        if (this.listeners[channel]) {
            this.listeners[channel].forEach(cb => cb(data));
        }
    }
}

// Export a singleton instance
export const realtimeService = new RealtimeService();