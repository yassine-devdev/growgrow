# Footer / Global Dock: Design &amp; Functionality

This document provides a detailed breakdown of the application's global footer component. The footer is designed to be a persistent "dock," offering access to global controls and the overlay app ecosystem without interfering with the main content area.

## 1. Design Philosophy

-   **Name**: Global Dock
-   **Concept**: A sleek, "glassmorphism" style dock that is always present at the bottom of the viewport. It provides a high-end, modern feel and serves as the anchor for the application's multi-tasking capabilities.
-   **Appearance**:
    -   **Background**: A semi-transparent, blurred dark gradient (`backdrop-blur-[15px] bg-[linear-gradient(...)]`).
    -   **Border**: A subtle, glowing top border and a faint white border (`border border-white/[.08]`) to lift it off the background.
    -   **Interactivity**: The entire dock has a `group` class with `hover` effects that intensify the shadows and reveal subtle gradient and radial glows, making it feel responsive and alive.
-   **Implementation**: `components/layout/Footer.tsx`.

---

## 2. Interactive Elements

### 2.1. App Launcher

This is the primary gateway to the Super App's ecosystem of overlay applications.

-   **Button Name**: App Launcher Buttons
-   **Icons**: `Layers` and `Grid3x3` icons from lucide-react.
-   **Action**:
    -   `onClick`: Toggles a boolean state `isLauncherOpen`.
    -   This state controls the visibility and transition of the App Launcher Tray.
    -   The button has `aria-expanded` and `aria-controls` attributes for accessibility.
-   **Appearance**: Circular, glassy buttons on the far left of the dock.
-   **States**:
    -   **Default**: `bg-white/5`, `border-white/10`.
    -   **Hover**: Background changes to `bg-brand-primary`.

#### App Launcher Tray

This is the floating panel that appears above the footer when the App Launcher is clicked.

-   **Name**: App Launcher Tray
-   **ID**: `app-launcher-tray`
-   **Appearance**: A floating, blurred-background container (`bg-black/50 backdrop-blur-xl`) that holds a grid of application icons.
-   **Behavior**:
    -   Appears with a fade-and-translate-up animation (`transition-all duration-300 ease-in-out`).
    -   It is conditionally rendered based on the `isLauncherOpen` state.
    -   Clicking any app icon inside the tray will call the `handleAppClick(app.id)` function.
-   **App Buttons inside Tray**:
    -   **Action**: `onClick={() => handleAppClick(app.id)}`, which calls the global Zustand store action `openOverlay(id)`.
    -   **Appearance**: An icon with a text label below it.
    -   **State**: Has a `hover:bg-white/10` effect to indicate interactivity.

#### Launched Applications

The tray provides access to the full suite of 13 overlay applications available in the Super App ecosystem. The following table details each application:

| Application Name | ID (`appId`)   | Description                                                              |
| ---------------- | -------------- | ------------------------------------------------------------------------ |
| **Studio**       | `studio`       | A suite of creative tools for design, video, coding, and office work.      |
| **Media**        | `media`        | A gallery for viewing and managing images and videos.                    |
| **Gamification** | `gamification` | Displays leaderboards and tracks personal achievements to encourage engagement. |
| **Leisure**      | `leisure`      | A portal for booking travel, tours, and other leisure activities.        |
| **Market**       | `market`       | An e-commerce marketplace for purchasing goods like supplies and electronics. |
| **Lifestyle**    | `lifestyle`    | A hub for booking personal services like spa treatments or fitness sessions. |
| **Hobbies**      | `hobbies`      | A discovery platform for finding and learning about new hobbies.         |
| **Knowledge**    | `knowledge`    | A searchable knowledge base and resource library for learning.           |
| **Sports**       | `sports`       | Provides schedules for upcoming games and league standings.              |
| **Religion**     | `religion`     | A community hub for finding locations and viewing event schedules.       |
| **Services**     | `services`     | A directory for finding and requesting quotes from professional services.  |
| **Finance**      | `finance`      | A personal finance tool for tracking income, expenses, and budgets.      |
| **Help**         | `help`         | The application's main help center with FAQs and support links.          |


### 2.2. Minimized Dock

This area dynamically displays icons for any overlay windows that have been minimized.

-   **Component**: `components/overlays/MinimizedDock.tsx`
-   **Behavior**:
    -   Reads the `openOverlays` array from the Zustand store.
    -   Filters the array to find any overlays where `isMinimized` is `true`.
    -   Renders nothing if no apps are minimized.
    -   For each minimized app, it renders a **Dock Button**.
-   **Minimized App Button**:
    -   **Icon**: The specific icon of the minimized app (e.g., `Studio`, `Media`).
    -   **Action**: `onClick={() => openOverlay(appConfig.id)}`. This action sets the app's `isMinimized` state to `false` and brings it to the front, effectively restoring the window.
    -   **Accessibility**: Has an `aria-label` like "Restore Studio" for screen readers.

### 2.3. Theme Switcher

Allows the user to switch between light, dark, and system themes.

-   **Button Name**: Theme Switcher Button
-   **Icon**: `Sun`, `Moon`, or `Monitor` depending on the active theme.
-   **Behavior**: A CSS `group-hover` interaction reveals a floating panel with buttons for each theme (`light`, `dark`, `system`).
-   **Action**: Clicking a theme button calls the `setTheme` action in the Zustand store.

### 2.4. Language Switcher

Provides a quick and simple way to change the application's language.

-   **Button Name**: Language Switcher Button
-   **Icon**: `Globe` icon.
-   **Behavior**: A `group-hover` interaction reveals a floating menu with language options.
-   **Language Buttons (EN, ES, FR, AR)**:
    -   **Action**: `onClick={() => changeLanguage('en')}`, which calls `i18n.changeLanguage()`.
    -   **State**: The currently active language has a `bg-brand-primary` background.

### 2.5. Cart Button

A dedicated button that acts as a shortcut to the Marketplace overlay and shows the number of items in the cart.

-   **Button Name**: Cart Button
-   **Icon**: `ShoppingCart` icon.
-   **Action**: `onClick={() => handleAppClick('market')}`. This is a shortcut that directly opens the Marketplace overlay app.
-   **Badge**:
    -   A red circular badge appears at the top-right corner of the button if `cartItemCount > 0`.
    -   It displays the total quantity of items in the cart.

### 2.6. Logout Button

The final action on the right, used to end the user's session.

-   **Button Name**: Logout Button
-   **Icon**: `LogOut` icon.
-   **Action**: `onClick={logout}`, which calls the `logout` action in the Zustand store, clearing the user's session data.
-   **Appearance**: A standard dock button.
-   **State**: On hover, the background turns red (`hover:bg-red-500/80`) to signify a destructive or final action.
-   **Accessibility**: Has an `aria-label` of "Logout".