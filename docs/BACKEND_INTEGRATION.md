# Backend Integration Guide

This document outlines the architecture and conventions used in the frontend to integrate with a live backend API. The application has been refactored from a mock-driven state to a production-ready client that communicates over HTTP.

## 1. Authentication & Authorization

The application uses a secure, token-based authentication flow based on **JSON Web Tokens (JWT)**, implemented with **secure, HttpOnly cookies**. This is the industry best practice for web application security.

### 1.1. Authentication Flow

1.  **Login Endpoint**: The `LoginPage` component sends a `POST` request to `/api/auth/login`. In a production app, this would contain credentials. For this implementation, it sends the desired user `role`.
2.  **Token Issuance (Backend)**: The backend is expected to validate the credentials, generate a JWT, and set it in a **`HttpOnly`**, **`Secure`**, and **`SameSite=Strict`** cookie in the response headers. The response body should contain the `user` object but **not** the token itself.
3.  **Frontend Storage**:
    -   The `login` action in `useAppStore` is called with just the `user` object.
    -   The frontend **never sees, stores, or handles the JWT**. The browser securely stores the cookie and automatically attaches it to all subsequent requests to the same domain.
    -   The `user` object is saved to `localStorage` via Zustand's `persist` middleware to maintain the UI state across reloads.

### 1.2. Authenticated Requests

-   **API Client**: A central `apiClient` (`api/apiClient.ts`) has been created to handle all API requests.
-   **Automatic Cookie Handling**: The `apiClient` is configured with `credentials: 'include'`. This tells the browser to automatically send the authentication cookie with every request. No manual `Authorization` header is needed, which simplifies the code and enhances security.

### 1.3. Logout

-   The `logout` action in `useAppStore` clears the `user` object from the Zustand state and `localStorage`.
-   A robust implementation should also make a request to a `/api/auth/logout` endpoint. The backend should respond by clearing the authentication cookie, ensuring the session is terminated on both the client and server.

## 2. API Client (`api/apiClient.ts`)

A wrapper around the native `fetch` API serves as the single point of entry for all backend communication.

-   **Base URL**: A `API_BASE_URL` is configured (defaults to `/api`) to prefix all requests. This should be configured via environment variables in a production build.
-   **Standardized Headers**: Automatically sets `Content-Type: application/json`.
-   **Error Handling**: If an API response has a non-2xx status code, the `apiClient` will throw a custom `ApiError`. This class contains the HTTP status and response body, allowing for richer error handling in the UI and integrating seamlessly with TanStack Query.
-   **Streaming Support**: A separate `apiStream` function is provided to handle streaming responses, which is used for the AI Concierge feature.

## 3. API Endpoint Conventions

The mock API functions have been replaced with `apiClient` calls to RESTful endpoints.

### 3.1. Pagination & Sorting

For data tables, the frontend sends standardized query parameters that the backend should support:

-   `page`: The page number (1-indexed).
-   `pageSize`: The number of items per page.
-   `sortBy`: The key to sort by (e.g., `name`).
-   `order`: The sort direction (`asc` or `desc`).
-   `search`: A global search filter string.

**Example Request**: `GET /api/users/admins?page=1&pageSize=10&sortBy=name&order=asc&search=john`

The backend is expected to return a `PaginatedResponse` object: `{ rows: T[], pageCount: number, rowCount: number }`.

### 3.2. Security Note: AI Concierge Proxy

The `api/conciergeApi.ts` file calls a backend proxy, which is a critical security pattern.

-   **Frontend Request**: The frontend makes a `POST` request to a backend endpoint at `/api/concierge/chat`.
-   **Backend Responsibility**: The backend server **must** act as a secure proxy. It receives the prompt from the user, adds its own secret API key, calls the Google Gemini API, and streams the response back to the client. This ensures the API key is never exposed to the public.

## 4. Data Fetching & Mutations (TanStack Query)

The application's use of TanStack Query remains the same, but the implementation details have changed.

-   **`queryFn`**: All `queryFn` properties now call a function from our API layer that uses the `apiClient` to make a `GET` request.
-   **`mutationFn`**: All `mutationFn` properties now call API functions that use `POST`, `PUT`, or `DELETE` methods.
-   **Zod Validation**: Zod schemas are still used to parse the data received from the live API, ensuring that the frontend remains type-safe and resilient against unexpected API responses.

## 5. Real-time Features (WebSockets)

The mock `realtimeService` has been upgraded to a more realistic implementation that attempts to connect to a WebSocket server (`ws://...`).

-   **Connection**: The service now uses the browser's `WebSocket` API. It includes basic logic for handling connection open, close, and error events, including a simple reconnect strategy.
-   **Message Handling**: It expects incoming WebSocket messages to be in a JSON format: `{ "channel": "string", "data": "any" }`. It then broadcasts this data to the relevant parts of the application (e.g., the notification store or the TanStack Query cache) using an internal pub/sub system. This makes the frontend fully prepared for a real-time backend.