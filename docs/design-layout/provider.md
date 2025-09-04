# Provider: Design & Layout Guide

This document outlines the design system, layout principles, and component styling for the **Provider** user role. The Provider interface is designed to be a professional, data-dense, and highly functional command center for managing the entire SaaS platform.

## 1. Design Philosophy

The Provider UI is built on three core principles:

-   **Clarity**: In a data-rich environment, information must be presented clearly and concisely. We prioritize scannable layouts, clear hierarchies, and intuitive data visualizations.
-   **Efficiency**: The Provider's workflows involve complex tasks like tenant management, system monitoring, and financial analysis. The design must streamline these tasks, reducing clicks and minimizing cognitive load.
-   **Control**: The interface should empower the Provider with a sense of complete control and oversight over the platform.

## 2. Color Palette

The color scheme is professional and minimalistic, using color strategically to draw attention to key information and actions.

-   **Primary (`#4f46e5`)**: Used for primary action buttons ("Create School"), active navigation states, chart highlights, and important icons. It signifies interactivity and key data points.
-   **Accent (`#34d399`)**: A secondary color used in charts and for positive change indicators to provide visual contrast without overwhelming the user.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Form the backbone of the UI, creating a clean and spacious canvas that allows data and content to stand out.
-   **Text (`#111827`, `#6b7280`)**: High-contrast dark gray for primary text ensures readability, while a lighter gray is used for secondary information to create a clear visual hierarchy.

## 3. Typography

-   **Font**: `Inter` is used for its excellent readability on screens, especially for numerical data in tables and charts.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Section Titles (`h2`, `h3`)**: lg/xl (18/20px), font-bold.
    -   **Body/Table Text**: sm (14px), font-normal or font-medium.
    -   **Labels/Secondary Text**: xs (12px), font-medium.

## 4. Core Layout Components

The Provider's layout is a consistent, three-column structure designed for efficient navigation and task management.

-   **Right Sidebar (L0 Navigation)**: The main navigational spine. It uses our custom, vibrant icons for quick recognition of top-level modules like `Dashboard`, `Schools`, `Tools`, and `System`. Active modules are highlighted with a `brand-primary` background and a `shadow-glow` effect.
-   **Header (L1 Navigation)**: Displays the title of the active L0 module. The L1 navigation tabs (e.g., "Analytics," "Monitoring") are designed for quick toggling between major sections within a module. The active tab uses the primary color fill for clear visual indication.
-   **Left Sub-navigation (L2 Navigation)**: Appears when an L1 item has children. It provides a tertiary level of navigation, allowing the Provider to drill down into specific views (e.g., "Usage Stats," "Server Status"). The layout is icon-centric for quick scanning.
-   **Content Area**: The main workspace. It's a spacious area with a `p-4` or `p-6` padding inside a rounded container. Content is typically organized into cards or full-bleed data tables to maintain a clean structure.
-   **Footer**: Provides access to the global app launcher, allowing the Provider to use any of the overlay apps without leaving their primary workflow.

## 5. Key Views & Component Styling

-   **Dashboards**:
    - **Command Center**: The default dashboard view. It provides a high-level overview of the entire platform's health, with `StatCard`s for global metrics and a list of `SchoolCard`s that summarize the health and key stats of each tenant school. Each `SchoolCard` links to a detailed view.
    - **Analytics & Monitoring**: These dashboards make extensive use of `StatCard` components for at-a-glance metrics and `recharts` for detailed visualizations. Charts use the primary and accent colors for data series.
-   **Data Tables (`DataTable.tsx`)**: A critical component for the Provider. The design is clean, with ample whitespace, subtle row hover effects (`hover:bg-brand-surface-alt/50`), and clear header sorting indicators.
-   **Forms (`NewSchoolForm.tsx`)**: Forms are structured within cards (`bg-brand-surface-alt/50`) for visual grouping. Input fields have a subtle border, with a `brand-primary` ring on focus. Validation errors are displayed in red text below the field.
- **AI Tools (Sandbox, Marketing)**: The Provider's tools leverage AI for tasks like generating marketing copy or simulating campaign outcomes. These views use a two-panel layout: an "input" panel for configuring the AI prompt, and an "output" panel (often styled like a code block) to display the generated results.

## 6. Buttons

The Provider UI uses several button styles to differentiate actions:

-   **Primary Action**: Solid `brand-primary` background for major actions like "Create School" or "Save Changes." This is the most prominent button style.
-   **Icon-Only Actions**: Minimalist, icon-only buttons for "Edit" and "Delete" actions in data tables, saving space and reducing visual clutter.
-   **Modal Actions**: Standard primary buttons, typically aligned to the right in the modal footer to confirm an action.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.