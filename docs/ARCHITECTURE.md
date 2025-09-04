# Application Architecture

This document provides a detailed overview of the technical architecture and core concepts behind the SaaS Super App.

## Frontend Stack

The application is a modern single-page application (SPA) built with the following technologies:

- **React 19**: The core UI library.
- **TypeScript**: For static typing, improving code quality and maintainability.
- **Zustand**: For lightweight global UI state management (e.g., user session, open overlays, theme).
- **TanStack Query v5**: For managing server state, including data fetching, caching, and synchronization.
- **React Router v6**: For all client-side routing and navigation.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Zod**: For schema declaration and data validation, ensuring type safety from the API layer to the UI.
- **i18next**: For handling internationalization and translations.
- **Google Gemini API**: Integrated via a secure backend proxy for AI-powered features.

## Directory Structure

The project is organized into a modular and scalable directory structure:

- **/api**: Contains all API call definitions and Zod schemas.
  - **/api/schemas**: Holds Zod schemas for validating API data structures.
- **/components**: Reusable React components.
  - **/components/layout**: Structural components like `DashboardLayout`, `Header`, `Footer`.
  - **/components/ui**: Generic UI elements like `DataTable`, `StatCard`, `Modal`, `CommandPalette`.
  - **/components/overlays**: Components related to the overlay window system.
- **/constants**: Application-wide constants, such as navigation configuration (`navigation.ts`) and TanStack Query keys (`queries.ts`).
- **/context**: React context providers, like `FeatureFlagContext` and `AppContext`.
- **/docs**: Project documentation files (like this one).
- **/e2e**: End-to-end tests written with Playwright.
- **/hooks**: Custom React hooks, like `useForm` for form management and `useRealtime` for WebSocket subscriptions.
- **/locales**: JSON files for internationalization (i18n).
- **/services**: Business logic decoupled from UI, like `featureFlagService` and `realtimeService`.
- **/store**: Zustand store for global state management.
- **/types**: Global TypeScript type definitions.
- **/views**: Top-level page/view components that are rendered by the router.

## Core Concepts

### 1. Role-Based Access Control (RBAC) & Navigation

The entire application experience is driven by the user's role.

- **`constants/navigation.ts`**: This file is the single source of truth for the app's navigation structure. The `NAVIGATION_CONFIG` object maps each `Role` (Provider, Admin, Teacher, etc.) to an array of modules and their respective navigation links.
- **Dynamic Rendering**: Components like `RightSidebar`, `Header`, and `LeftSubnav` read the configuration based on the current user's role (from the Zustand store) and render only the permitted navigation links.
- **Route-level Control**: The main content router, `views/content/ContentArea.tsx`, uses the user's role to render role-specific dashboard and module components, effectively controlling access to entire sections of the application.

### 2. State Management Strategy

State is divided into two main categories:

- **Global UI State (Zustand)**: Managed in `store/useAppStore.ts`. This store holds client-side state that needs to be accessed globally. It manages the `user` session, `openOverlays` state, `theme`, `cart`, `notifications`, `toasts`, `isMobileNavOpen`, and `isCommandPaletteOpen`. It uses `persist` middleware to save critical settings like the user session and theme to `localStorage`.
- **Server State (TanStack Query)**: Used for all data fetched from the backend API. It handles caching, background refetching, and stale-while-revalidate logic. Centralized query keys in `constants/queries.ts` ensure consistency. This approach keeps API data out of the global store, simplifying state management and preventing synchronization issues.

### 3. The Overlay Window System

This system mimics a desktop environment, allowing multiple "apps" to run concurrently in floating windows.

- **`OverlayManager.tsx`**: Renders active (non-minimized) overlay windows by reading the `openOverlays` array from the Zustand store.
- **`OverlayWindow.tsx`**: The core component for a single window. It manages its own position and size and contains the logic for dragging, resizing, and window controls. It also implements an accessibility focus trap.
- **Lazy Loading**: Overlay app components (in `components/overlays/apps/`) are lazy-loaded, meaning their code is only fetched from the server when a user first opens them, improving initial application load time.
- **`Footer.tsx` & `MinimizedDock.tsx`**: The footer acts as a dock. It contains the app launcher and the `MinimizedDock`, which renders icons for any minimized windows, allowing them to be restored.

### 4. Backend Integration & Data Validation

The application is built to connect to a live backend, not just a mock API.

- **`api/apiClient.ts`**: A centralized `fetch` wrapper that handles all HTTP requests. It standardizes error handling, sets headers, and includes credentials (`HttpOnly` cookies) automatically. For a full explanation, see the **[Backend Integration Guide](./BACKEND_INTEGRATION.md)**.
- **Zod Schemas**: Every data structure expected from the API has a corresponding Zod schema defined in `/api/schemas/`. Before data is made available to the app (via TanStack Query), it is parsed by its schema. This guarantees that the data is type-safe and structurally correct, catching potential bugs at the data layer.
