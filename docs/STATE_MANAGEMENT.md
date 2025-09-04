# State Management

The application employs a clear and robust state management strategy by separating client-side UI state from server-side data (server state). This separation simplifies logic, improves performance, and makes the application easier to maintain.

## 1. Global UI State: Zustand

Zustand is used for managing global state that is specific to the user's interaction with the UI and is not persisted on a server.

-   **Location**: The entire global store is defined in `store/useAppStore.ts`.
-   **Hook**: State and actions are accessed in components via the `useAppStore` hook.

### What It Manages

The Zustand store is intentionally kept lean and only holds state that is truly global and client-side:

-   **`user`**: Stores the current authenticated user's object. This is the primary piece of state that drives the role-based UI.
-   **`openOverlays`**: An array of `OpenOverlay` objects that tracks the state of all overlay windows (which are open, which are minimized, and their stacking order via `zIndex`).
-   **`theme`**: The current UI theme ('light', 'dark', or 'system').
-   **`cart`**: An array of `CartItem` objects for the Marketplace overlay.
-   **`notifications`**: An array of `Notification` objects for the notification center.
-   **`toasts`**: An array of active `Toast` messages displayed in the `ToastContainer`.
-   **`isMobileNavOpen`**: A boolean to control the visibility of the slide-out navigation on mobile devices.
-   **`isCommandPaletteOpen`**: A boolean to control the visibility of the command palette.

### Key Features

-   **Simplicity**: Zustand provides a simple, hook-based API that is easy to understand and use.
-   **Persistence**: The store uses Zustand's `persist` middleware to save the `user` and `theme` to `localStorage`. This allows the user's session and visual preferences to be restored when they refresh the page. Transactional state like the cart and notifications is not persisted.

### Example Usage

```typescript
// In a component
import { useAppStore } from '@/store/useAppStore';

const MyComponent: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const theme = useAppStore((state) => state.theme);
    const setTheme = useAppStore((state) => state.setTheme);

    return (
        <div>
            <p>Current User Role: {user?.role}</p>
            <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
        </div>
    );
};
```

## 2. Server State: TanStack Query (React Query)

TanStack Query is used to manage all data that is fetched from the backend API. It is the definitive tool for fetching, caching, synchronizing, and updating server data in the application.

-   **Provider**: The `QueryClientProvider` is set up at the root of the application in `App.tsx`.
-   **Query Keys**: To ensure consistency and avoid typos, all query keys are centralized in `constants/queries.ts`.

### What It Manages

-   **Data Fetching**: Handles all API calls through the `useQuery` hook.
-   **Caching**: Automatically caches fetched data. If the same data is requested again, it is served from the cache first for a near-instant user experience.
-   **Background Updates**: Intelligently refetches data in the background to keep it fresh (stale-while-revalidate).
-   **Loading & Error States**: `useQuery` provides convenient boolean flags (`isLoading`, `isError`) that make it simple to render loading skeletons or error messages.
-   **Data Mutations**: The `useMutation` hook is used for actions that create, update, or delete data (e.g., submitting a form), providing `onSuccess` and `onError` callbacks to handle side effects like showing toasts and invalidating cached data.

### Example Usage

```typescript
// In a dashboard component
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardData } from '@/api/dashboardApi';
import { QUERY_KEYS } from '@/constants/queries';

const AdminDashboard: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.adminDashboard,
        queryFn: getAdminDashboardData,
    });

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    // ... render dashboard with data
};
```
