# Admin: Design & Layout Guide

This document details the design system and layout principles for the **School Administrator** role. The Admin interface is a streamlined and professional tool focused on school operations, user management, and high-level academic oversight.

## 1. Design Philosophy

The Admin UI is designed to be:

-   **Organized**: Admins manage a wide range of school data. The layout must be logically structured to make information easy to find and manage.
-   **Action-Oriented**: The interface prioritizes common administrative tasks, making it easy to manage users, view school-wide data, and handle communications.
-   **Approachable**: While powerful, the design avoids overwhelming complexity, presenting information in clear, digestible formats like cards and simple charts.

## 2. Color Palette

The color palette is consistent with the application's global theme, using color to guide the user and highlight important information.

-   **Primary (`#4f46e5`)**: Used for primary action buttons (e.g., "Add Student" in an overlay), active navigation states, and key data points in charts.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Used for the background, cards, and surfaces to create a clean, uncluttered interface that feels professional and focused.
-   **Text (`#111827`, `#6b7280`)**: High-contrast dark gray for primary text ensures readability, with a lighter gray for secondary details.
-   **Status Colors**: Semantic colors are used in badges and dashboards (e.g., green for "Active" users, red for "Past Due" fees) for at-a-glance status checks.

## 3. Typography

-   **Font**: `Inter` is used for its clarity and professional feel, suitable for both text and data.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Dashboard/Card Titles (`h3`)**: lg (18px), font-bold.
    -   **Body/Table Text**: sm (14px), font-normal.
    -   **Labels/Secondary Text**: xs (12px), font-medium.

## 4. Core Layout Components

The Admin's layout provides a clear, consistent structure for navigating school-related modules.

-   **Right Sidebar (L0 Navigation)**: Provides access to Admin-specific modules like `Dashboard`, `School Hub`, `Comms`, and `System`. The active module is clearly marked with a `brand-primary` background.
-   **Header (L1 Navigation)**: Displays the current module's title. For a module like `School Hub`, the L1 tabs allow quick access to "Academics," "People," and "Billing."
-   **Left Sub-navigation (L2 Navigation)**: Enables drilling down into specific management areas. For example, under "People," the Admin can select "Students" or "Teachers" to view the respective directories.
-   **Content Area**: The central workspace. The default view is the `AdminDashboard`, which is a comprehensive hub for school operations.
-   **Footer**: Provides global access to overlay apps like the Marketplace or Studio, which may be used for school procurement or creating school materials.

## 5. Key Views & Component Styling

-   **Admin Dashboard**: The landing page is designed for high-level oversight and quick action.
    -   **`StatCard`s**: Display key school metrics at the top (Total Students, Staff, etc.).
    -   **Quick Links**: A prominent card with large, clickable icons that navigate directly to the most common management pages (e.g., "Manage Students", "View Teacher Directory").
    -   **Enrollment Trends**: An `AreaChart` visualizes student enrollment trends over time.
    -   **Action Items & Communication Hub**: Sidebar-style cards on the right provide a feed of important action items and recent school announcements, with a button to create a new announcement.
-   **People Management (School Hub > People)**: These views utilize the `DataTable` component to display lists of students and teachers, allowing for searching and sorting. The "Add" button launches a modal for data entry.
-   **Billing Summary (School Hub > Billing)**: A read-only view that presents subscription and invoice data in clean, easy-to-read cards.

## 6. Buttons

The Admin UI uses a clear and consistent button hierarchy:

-   **Primary Action**: Solid `brand-primary` buttons are used for the main action in a view, such as "Create New Announcement" or the confirmation button inside a modal.
-   **Navigation Links**: The "Quick Links" on the dashboard are styled as large, interactive cards for easy access.
-   **Secondary/Link Buttons**: Simple text-based buttons with a `hover:underline` effect are used for less critical actions, like "Mark all as read" in the notification center.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.