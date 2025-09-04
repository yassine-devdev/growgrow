// Minimal polyfills for the Jest environment used by these tests.
// Provides ReadableStream and ensures Headers/FormData exist under jsdom where needed.
// Keep this small and safe — tests can provide richer mocks if necessary.

// Polyfill ReadableStream if missing (jsdom/node may not provide it).
/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof (global as any).ReadableStream === 'undefined') {
  // Minimal stub for tests that only check for presence / identity
  (global as any).ReadableStream = class ReadableStream {}
}

// Ensure Headers exists (jsdom usually has it, but be defensive)
if (typeof (global as any).Headers === 'undefined') {
  // Use a very small polyfill sufficient for tests that call new Headers() and .get/.has
  (global as any).Headers = class Headers {
    private store: Record<string, string> = {};
    constructor(init?: any) {
      if (init && typeof init === 'object') {
        Object.entries(init).forEach(([k, v]) => (this.store[k.toLowerCase()] = String(v)));
      }
    }
    get(k: string) { return this.store[k.toLowerCase()] ?? null; }
    has(k: string) { return k.toLowerCase() in this.store; }
    set(k: string, v: string) { this.store[k.toLowerCase()] = String(v); }
  };
}

// Basic global.fetch stub is provided by tests when needed; no-op here.
