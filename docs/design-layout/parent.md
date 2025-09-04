# Parent: Design & Layout Guide

This document describes the design system and layout principles for the **Parent** user role. The Parent interface is designed to be a simple, clear, and reassuring portal for staying informed about their child's academic life and managing school-related responsibilities like payments.

## 1. Design Philosophy

The Parent UI is built around three key ideas:

-   **At-a-Glance Information**: Parents are often busy. The design prioritizes surfacing the most important information (grades, attendance, deadlines, announcements, fees) immediately on the dashboard.
-   **Trustworthiness**: The interface uses a clean, professional, and organized design to build trust and convey reliability.
-   **Ease of Use**: Navigation and actions, especially critical ones like paying fees, are designed to be as simple and straightforward as possible.

## 2. Color Palette

The global color palette is used to create a calm and professional-looking interface.

-   **Primary (`#4f46e5`)**: Used for key action buttons like "Pay Now" and for highlighting active navigation elements.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: These colors dominate the UI, creating a clean, spacious, and non-distracting environment for viewing information.
-   **Semantic Colors**:
    -   **Green (`#22c55e`)**: Used for icons related to finances (`CreditCard`) and to indicate positive statuses.
    -   **Yellow (`#f59e0b`)**: Used for announcement icons (`Bell`) to gently draw attention to important school communications.
    -   **Red (`#ef4444`)**: Used for due dates to create a sense of urgency.

## 3. Typography

-   **Font**: `Inter` is used for its excellent readability, ensuring that all information is clear and easy to understand.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Child Name/Section Titles (`h2`)**: xl (20px), font-bold.
    -   **Card Titles (`h3`)**: lg (18px), font-bold.
    -   **Body Text**: sm (14px).

## 4. Core Layout Components

The Parent layout is structured to be simple and easy to navigate.

-   **Right Sidebar (L0 Navigation)**: A simplified set of modules relevant to parents, including `Dashboard`, `School Hub` (for grades and courses), and `Comms`.
-   **Header (L1 Navigation)**: Provides clear navigation within the selected module.
-   **Left Sub-navigation (L2 Navigation)**: Allows parents to switch between viewing their child's "Courses" and "Grades."
-   **Content Area**: The `ParentDashboard` is the primary interface. It uses a multi-column layout to present different categories of information simultaneously: a main area for child-specific academic overviews and deadlines, and a sidebar for school-wide announcements, recent grades, and pending fees.
-   **Footer**: Standard footer, giving parents access to overlay apps like the `Marketplace` for school supplies or the `Help` center.

## 5. Key Views & Component Styling

-   **Parent Dashboard**:
    -   **Child Overview Card**: Each child has a dedicated card (`bg-brand-surface`) containing `StatCard`s for their key metrics (GPA, Attendance, etc.). This provides a quick, comparative overview if there are multiple children. A "Message Teacher" button provides a quick action link.
    -   **Upcoming Deadlines Card**: Aggregates all important dates (assignments, events) for all children into a single, scannable list, helping parents stay organized.
    -   **Recent Grades Card**: A feed showing the latest grades posted for all children, allowing parents to stay up-to-date on academic performance.
    -   **Announcements & Fees Cards**: Sidebar cards provide access to school-wide announcements and a clear call-to-action for paying fees.
-   **Payment View (`PaymentView.tsx`)**:
    -   **Layout**: A two-column layout separates the "Order Summary" from the credit card form, mirroring familiar e-commerce checkout patterns for ease of use.
    -   **Form Fields**: Input fields are large, clean, and include icons (`CreditCard`, `Lock`) to provide visual cues and reinforce security.

## 6. Buttons

The Parent UI uses a focused set of buttons to guide the user through key tasks:

-   **Primary Action**: The "Pay Now" button is the most prominent button in this view. It is a large, solid `brand-primary` button designed to be the main call-to-action, simplifying the payment process. It includes clear loading and success states.
-   **Navigation Links**: Most other interactions are handled through standard navigation elements (`NavLink`) or by clicking on descriptive links within the interface.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.