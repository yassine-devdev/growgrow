# API Reference

This document details the structure and functionality of the application's API layer. The frontend is built to communicate with a live backend via a RESTful API, with all client-side logic for this communication centralized in the `/api` directory.

## Core Concepts

### 1. The `apiClient`

- **Location**: `api/apiClient.ts`
- **Functionality**: A centralized wrapper around the native `fetch` API that serves as the single point of entry for all backend communication.
- **Key Features**:
    - **Base URL**: Prefixes all requests with a standard base URL (`/api`).
    - **Authentication**: Automatically includes credentials (i.e., the `HttpOnly` JWT cookie) with every request using `credentials: 'include'`.
    - **Standardized Headers**: Sets `Content-Type: application/json` for relevant requests.
    - **Error Handling**: Throws a custom `ApiError` for non-2xx responses, which integrates seamlessly with TanStack Query's `isError` state.
    - **Streaming**: Provides a separate `apiStream` function for handling streaming responses (used for the AI Concierge).
- **Further Reading**: For a detailed explanation of the authentication flow, see the **[Backend Integration Guide](./BACKEND_INTEGRATION.md)**.

### 2. Data Validation with Zod

A key feature of the API layer is its integration with Zod for schema validation.

- **Schema-First**: For every data type, a Zod schema is defined in the `/api/schemas/` directory.
- **Type Safety**: Before any data from an API response is returned from a service function, it is parsed using its corresponding Zod schema (e.g., `adminSchema.array().parse(data)`).
- **Benefits**: This approach guarantees that the data consumed by the application (via TanStack Query) is always structurally correct and type-safe, preventing a wide class of runtime errors and making the frontend resilient to unexpected API changes.

## API Modules

### Authentication
- **`api/authApi.ts`**: Handles the user login flow.
  - `loginUser()`: Sends a role to `/api/auth/login`; the backend is expected to respond with the user object and set a secure `HttpOnly` cookie.

### Dashboards
- **`api/dashboardApi.ts`**: Fetches aggregated data for the main dashboard of each user role.
- **`api/providerApi.ts`**: Fetches data for the Provider's dashboards (Command Center, Analytics, Monitoring).
- **`api/adminApi.ts`**: Fetches data for Admin-specific views, like Academic Health.

### School & User Management
- **`api/schoolOnboardingApi.ts`**: Manages the workflow for a Provider onboarding a new school tenant.
- **`api/schoolManagementApi.ts`**: A large module covering the various management panels available to a Provider (managing schools, admins, teachers, students, parents, billing, white-label settings, and support tickets).
- **`api/schoolHubApi.ts`**: Provides data for the common modules shared by school-based roles (Admin, Teacher, etc.), such as courses, grades, announcements, and user profiles.

### Role-Specific APIs
- **`api/studentApi.ts`**: Handles student-specific actions like submitting assignments and wellness check-ins.
- **`api/parentApi.ts`**: Handles parent-specific actions, primarily for viewing and paying school fees.
- **`api/individualApi.ts`**: Fetches data for the Individual user's personal hub (bookings, orders, etc.).

### App Modules & Overlays
- **`api/appModulesApi.ts`**: A general-purpose API that provides data for many of the more generic or shared views, including Provider tools (marketing, finance, etc.) and most Overlay Apps (media, gamification, etc.).
- **`api/marketApi.ts`**: Specific endpoints for the Marketplace overlay, such as fetching products and processing checkout.
- **`api/dataStudioApi.ts`**: Endpoints for the Provider's Data Studio tool, including managing data connectors.

### System & Services
- **`api/notificationsApi.ts`**: Fetches notifications for the user's notification center.
- **`api/conciergeApi.ts`**: Proxies requests to the backend for the AI Concierge feature, ensuring the Google Gemini API key is never exposed on the client.
