/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { apiClient, apiStream, ApiError } from "../../../src/api/apiClient";

function createMockFetch() {
  const calls: any[] = [];
  const impls: any[] = [];
  const mock: any = function (...args: any[]) {
    calls.push(args);
    const impl = impls.shift();
    if (impl) return impl(...args);
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });
  };
  mock.mockImplementationOnce = (fn: any) => {
    impls.push(fn);
  };
  mock.mockClear = () => {
    calls.length = 0;
    impls.length = 0;
  };
  mock.mock = { calls };
  return mock;
}

let mockFetch: any;

beforeEach(() => {
  mockFetch = createMockFetch();
  // @ts-ignore
  global.fetch = mockFetch;
});

afterEach(() => {
  try {
    mockFetch.mockClear?.();
  } catch (e) {}
  // @ts-ignore
  global.fetch = undefined;
});

describe("apiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should make a GET request with correct default options", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "success" }),
      })
    );

    const result = await apiClient("/test");

    const call = mockFetch.mock.calls[0];
    expect(call[0]).toBe("/api/test");
    const opts = call[1] as RequestInit | undefined;
    expect(opts?.method).toBe("GET");
    const headers = new Headers(opts?.headers);
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(opts?.credentials).toBe("include");
    expect(result).toEqual({ data: "success" });
  });

  it("should make a POST request with body and correct headers", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      })
    );

    const body = { name: "test" };
    await apiClient("/test", { method: "POST", body: JSON.stringify(body) });

    const post = mockFetch.mock.calls[0];
    expect(post[0]).toBe("/api/test");
    const postOpts = post[1] as RequestInit | undefined;
    expect(postOpts?.method).toBe("POST");
    expect(postOpts?.body).toBe(JSON.stringify(body));
    expect(postOpts?.credentials).toBe("include");
  });

  it("should not set Content-Type for FormData", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const formData = new FormData();
    formData.append("file", new Blob());

    await apiClient("/upload", { method: "POST", body: formData });
    const callOptions = mockFetch.mock.calls[0][1] as RequestInit | undefined;
    const headers = new Headers(callOptions?.headers);
    expect(headers.has("Content-Type")).toBe(false);
  });

  it("should throw ApiError on non-ok response with a JSON body", async () => {
    const errorBody = { message: "Not Found" };
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorBody),
      })
    );

    await expect(apiClient("/not-found")).rejects.toMatchObject({
      status: 404,
      body: errorBody,
      message: "Not Found",
    });
  });

  it("should throw ApiError on non-ok response with a non-JSON body", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject("Invalid JSON"),
      })
    );

    await expect(apiClient("/server-error")).rejects.toMatchObject({
      status: 500,
      message: "HTTP Error: Internal Server Error",
    });
  });

  it("should handle empty 204 No Content response", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error("Should not be called")),
      })
    );

    const result = await apiClient("/delete", { method: "DELETE" });
    expect(result).toBeNull();
  });
});

describe("apiStream", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should return a readable stream on successful response", async () => {
    const mockStream = new ReadableStream();
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        body: mockStream,
      })
    );

    const result = await apiStream("/stream");
    expect(result).toBe(mockStream);
    const streamCall = mockFetch.mock.calls[0];
    expect(streamCall[0]).toBe("/api/stream");
    const streamOptions = streamCall[1] as RequestInit | undefined;
    expect(streamOptions?.credentials).toBe("include");
  });

  it("should throw ApiError on non-ok streaming response", async () => {
    const errorBody = { message: "Stream failed" };
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        body: null,
        json: () => Promise.resolve(errorBody),
      })
    );

    await expect(apiStream("/stream-fail")).rejects.toThrow(ApiError);
  });
});
