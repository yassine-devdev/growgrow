# Routing in the Super App

The application uses **React Router v6** for all client-side routing. The routing system is designed to be robust, handling authentication, role-based module access, and deeply nested views.

## 1. Top-Level Routing (`App.tsx`)

The root component, `App.tsx`, sets up the primary routing logic.

-   **`BrowserRouter`**: The entire application is wrapped in `<BrowserRouter>` in `index.tsx`.
-   **Authentication Guard**: The `App` component checks for the presence of a `user` in the Zustand store.
    -   If a `user` exists, it renders the `<DashboardLayout />`, which contains all authenticated routes. Any attempt to navigate to `/login` is redirected to the dashboard's home (`/`).
    -   If no `user` exists, it renders the `<LoginPage />` and redirects any other path to `/login`.

```typescript
// Simplified logic from App.tsx
{user ? (
    <Route path="/*" element={<DashboardLayout />} />
) : (
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
)}
```

## 2. Content Area Routing (`views/content/ContentArea.tsx`)

Once a user is logged in, the `ContentArea` component becomes the primary router for displaying module content. It uses the URL structure to determine what to render.

### URL Structure

The application uses a hierarchical URL structure: `/:l0_id/:l1_id/:l2_id`

-   `:l0_id`: The ID of the main module (from the right sidebar), e.g., `dashboard`, `schools`.
-   `:l1_id`: The ID of the header navigation item, e.g., `analytics`, `users`.
-   `:l2_id`: The ID of the left sub-navigation item, e.g., `usage-stats`, `admins`.

### Dynamic Module Rendering

The `ContentArea` component uses a `<Routes>` setup that maps the `:l0_id` parameter to the correct module view.

-   **`DefaultRedirector`**: A special component that handles the root `/` path. It reads the user's navigation config and redirects them to the very first available page, ensuring they always land on a valid view after login.
-   **Role-Based Routers**: `ContentArea` contains renderer functions (`renderProviderContent`, `renderSchoolContent`, etc.). Based on the logged-in user's role, it calls the appropriate function, which then uses a `switch` statement on the `:l0_id` to render the correct module's entry component (e.g., `ProviderDashboard`, `ProviderSchoolsView`).

### Nested & Detail Routing

Many module entry components act as routers themselves.

-   **Nested Routing Pattern**: `ProviderSchoolsView.tsx` doesn't render content directly. Instead, it sets up its own `<Routes>` to handle the `:l1_id` part of the URL, directing the user to `OnboardingView`, `UsersView`, etc. This pattern continues downwards, keeping routing logic co-located with the views it controls.
-   **Detail Route Pattern**: A new pattern has been introduced for "drill-down" views. For example, the Provider's Command Center links to a specific school's details. This is handled by a route with a parameter, like the one in `ProviderSchoolsView.tsx`:
    ```typescript
    <Route path="detail/:schoolId" element={<ProviderSchoolDetailView />} />
    ```
    This allows for creating detailed views for specific items without needing a dedicated navigation link for each one. The same pattern is used for viewing specific assignments (`/school-hub/academics/assignments/:assignmentId`).

This flexible routing system allows the application to scale easily while maintaining a clear and logical URL structure.
