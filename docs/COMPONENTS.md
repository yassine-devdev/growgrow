# Component Library Overview

This document provides an overview of the key React components that make up the SaaS Super App's user interface. For interactive demos and detailed prop information, please run **Storybook** (`npm run storybook`).

## Component Philosophy

-   **Reusability**: Components in `/components/ui` are designed to be generic and reusable across the entire application.
-   **Composition**: Views are built by composing layout components, UI components, and view-specific logic.
-   **Clarity**: Components are well-structured and include JSDoc or TypeScript interfaces explaining their purpose and props.

## 1. Layout Components

These components, located in `/components/layout`, form the main structure of the authenticated user experience.

-   **`DashboardLayout.tsx`**: The top-level wrapper for the entire dashboard. It orchestrates the arrangement of the header, sidebars, footer, and content area. It also handles the slide-out navigation for mobile views.
-   **`Header.tsx`**: The main header bar. It dynamically displays the current module's title and the L1 (header) navigation links.
-   **`RightSidebar.tsx`**: The primary (L0) navigation bar on the right, used for switching between top-level modules (e.g., Dashboard, Schools).
-   **`LeftSubnav.tsx`**: The secondary (L2) navigation panel on the left. It displays child links of the currently active L1 navigation item.
-   **`Footer.tsx`**: The application footer, which acts as a global dock. It contains the App Launcher, Minimized Dock, language switcher, theme switcher, and logout button.

## 2. UI Components

These are the generic, reusable building blocks found in `/components/ui`.

-   **`DataTable.tsx`**: A powerful, generic data table component that supports server-side sorting, pagination, and searching. It includes loading states and custom empty states.
-   **`StatCard.tsx`**: A card for displaying a single key statistic, complete with a label, value, an optional change indicator, and an icon. Used extensively in dashboards.
-   **`Modal.tsx`**: A general-purpose modal dialog component. It provides a clean, accessible foundation for pop-up forms and content.
-   **`Dialog.tsx`**: A specialized confirmation modal built on top of `Modal.tsx`. It provides a standardized way to ask for user confirmation for actions, with support for destructive variants.
-   **`ToastContainer.tsx`**: Manages the display of global "toast" notifications for feedback on user actions (e.g., success, error).
-   **`CommandPalette.tsx`**: A keyboard-driven (Cmd/Ctrl+K) search and navigation interface that allows users to quickly jump to any page.
-   **`Skeleton.tsx`**: A simple, animated placeholder component used to create loading skeletons for a better user experience while data is fetching.
-   **`Image.tsx`**: An image component that implements a "blur-up" loading effect for a smoother visual experience.
-   **`Icon.tsx` & `CustomIcons.tsx`**: Dynamic icon loaders for `lucide-react` and our custom multi-color SVG icons, respectively.
-   **Form Elements**:
    -   **`InputField.tsx`**: A standardized text input field with a label and error message display.
    -   **`SelectField.tsx`**: A styled `select` dropdown with a label and error display.
    -   **`ToggleSwitch.tsx`**: A styled toggle switch for boolean settings.

## 3. Overlay System Components

Located in `/components/overlays`, these components power the desktop-like windowing environment.

-   **`OverlayManager.tsx`**: The brain of the system. It reads the `openOverlays` state from the global store and renders an `OverlayWindow` for each active app. It also handles the lazy loading of app components.
-   **`OverlayWindow.tsx`**: A feature-rich component that represents a single floating window. It manages its own state for position and size and includes logic for dragging, resizing, minimizing, closing, and focus trapping for accessibility.
-   **`MinimizedDock.tsx`**: Renders icons in the footer for any app that has been minimized, allowing the user to restore it.
-   **App Components (`/components/overlays/apps/*.tsx`)**: Each file in this directory is a self-contained application designed to run inside an `OverlayWindow`. Examples include `StudioOverlay`, `MarketplaceOverlay`, `FinanceOverlay`, and `HelpOverlay`.
