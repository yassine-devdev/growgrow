# Individual: Design & Layout Guide

This document outlines the design system and layout for the **Individual** user role. The Individual interface is a personalized, consumer-facing hub designed for engagement, discovery, and managing personal life, learning, and commerce.

## 1. Design Philosophy

The Individual UI is designed to be:

-   **Engaging & Personal**: The interface feels like a personalized dashboard, with suggestions and activities tailored to the user's interests (e.g., product suggestions based on enrolled courses).
-   **Seamless**: The experience focuses on providing a smooth transition between different activities, from viewing the dashboard to opening the Marketplace overlay.
-   **Discovery-Oriented**: The UI encourages exploration, surfacing new products and courses through suggestion cards and a clean, visually appealing layout.

## 2. Color Palette

The global palette is used to create a more dynamic and consumer-friendly aesthetic.

-   **Primary (`#4f46e5`)**: Used frequently for calls-to-action, navigation, and to highlight interactive elements and icons.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Provide a bright and clean canvas that makes content and imagery stand out.
-   **Accent Colors**: A wider range of colors may be used within suggestion cards and overlay apps (e.g., greens for finance, pinks for lifestyle) to create a more vibrant and visually rich experience.

## 3. Typography

-   **Font**: `Inter` provides a modern, friendly, and highly readable foundation for the consumer-facing UI.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Card Titles (`h3`)**: lg (18px), font-bold.
    -   **Body Text**: sm (14px).
    -   **Suggestion Card Text**: sm (14px) for titles and xs (12px) for prices/categories.

## 4. Core Layout Components

The Individual layout is focused on providing a central dashboard with easy access to a wide variety of "apps."

-   **Right Sidebar (L0 Navigation)**: A simplified navigation structure with modules like `Dashboard`, `Personal Hub`, and `Knowledge`.
-   **Header (L1 Navigation)**: Provides navigation within the chosen module, such as "Lifestyle" and "Marketplace" under the `Personal Hub`.
-   **Left Sub-navigation (L2 Navigation)**: Offers deeper navigation, for example, to "Bookings" or "My Orders."
-   **Content Area**: The `IndividualDashboard` is the centerpiece. It's designed to be a dynamic space with `StatCard`s for personal metrics, a prominent "Suggestions For You" section, and a "Recent Activity" feed.
-   **Footer & App Launcher**: The footer is a critical component for the Individual user. The App Launcher is the primary gateway to the Super App's full functionality, providing access to a wide range of overlay apps for finance, hobbies, media, and more.

## 5. Key Views & Component Styling

-   **Individual Dashboard**:
    -   **`StatCard`s**: Focus on personal metrics like "Courses Enrolled" and "Marketplace Orders" to provide a quick summary of engagement.
    -   **`SuggestedProducts`**: This is a key feature that makes the dashboard feel personalized. It fetches products related to the user's enrolled courses and displays them in visually driven cards that use the `Image` component. These cards are clickable and open the `Marketplace` overlay directly.
    -   **Activity Feed**: A simple, clean list that provides a quick summary of recent interactions with the app, reinforcing a sense of progress.
-   **Overlay Apps**: Much of the Individual's experience takes place within overlay apps. These apps share a consistent design language:
    -   **Clean Headers**: A clear title and minimal controls.
    -   **Focused Content**: Each app is designed to do one thing well, with a simple, task-oriented layout. For example, the `MarketplaceOverlay` uses a familiar e-commerce layout with filters and a product grid.

## 6. Buttons

The Individual UI uses a variety of consumer-friendly buttons to drive engagement:

-   **Primary Action**: Solid `brand-primary` buttons are used for clear calls-to-action within overlay apps, such as "Add to Cart," "Book Now," or "Request Quote."
-   **Status / Completed Button**: To provide satisfying user feedback, buttons change state after an action. For instance, an "Add to Cart" button becomes a disabled, green "In Cart" button with a checkmark, preventing duplicate additions and confirming the action was successful.
-   **Footer / Dock Buttons**: The dark, glassy buttons in the footer provide a premium feel and give access to the main app launcher and other global controls.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.