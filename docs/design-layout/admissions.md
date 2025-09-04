# Admissions: Design & Layout Guide

This document outlines the design system and layout for the **Admissions Officer** role. The Admissions interface is a specialized tool designed for efficiently managing the applicant pipeline, reviewing applications, and tracking enrollment metrics.

## 1. Design Philosophy

The design for the Admissions role is centered on:

-   **Data-Driven Decisions**: The UI surfaces key metrics and trends upfront, helping admissions officers make informed decisions.
-   **Workflow Efficiency**: The layout is structured to support the admissions funnel, from reviewing new applicants to tracking accepted offers.
-   **Professionalism & Clarity**: The interface presents applicant information in a clean, organized, and professional manner.

## 2. Color Palette

The application's global color palette is used to create a professional and data-focused environment.

-   **Primary (`#4f46e5`)**: Used to highlight key data in charts (e.g., application trends), active navigation, and for important UI elements.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Form the foundation of the interface, ensuring that charts and applicant data are the main focus.
-   **Chart Colors**: A predefined, accessible color palette (`#4f46e5`, `#818cf8`, etc.) is used in the demographics pie chart to differentiate segments clearly.
-   **Text (`#111827`, `#6b7280`)**: Standard high-contrast text for maximum readability of names, dates, and statuses.

## 3. Typography

-   **Font**: `Inter` is chosen for its clarity, which is crucial when reviewing lists of applicant names and detailed information.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Card/Chart Titles (`h3`)**: lg (18px), font-bold.
    -   **Applicant Names**: sm (14px), font-semibold.
    -   **Secondary Info (Dates, Statuses)**: xs (12px), font-normal.

## 4. Core Layout Components

The layout for Admissions is a variant of the standard school layout, tailored to their specific needs.

-   **Right Sidebar (L0 Navigation)**: Provides access to Admissions-specific modules, primarily the `Dashboard`, `School Hub` (for applicant directories), and `Comms`.
-   **Header (L1 Navigation)**: Simple and focused. For the dashboard, it provides a single "Overview" tab.
-   **Left Sub-navigation (L2 Navigation)**: Allows for drilling down into specific lists, such as different applicant pools or stages.
-   **Content Area**: The `AdmissionsDashboard` is the main workspace. It is designed to give an immediate and comprehensive overview of the admissions pipeline.
-   **Footer**: Standard footer with access to overlay apps.

## 5. Key Views & Component Styling

-   **Admissions Dashboard**:
    -   **`StatCard`s**: Highlight the most critical, up-to-the-minute metrics: new applicants, pending reviews, accepted offers, and the overall enrollment rate.
    -   **Applicant Funnel**: A prominent, horizontal visualization that shows the number of applicants at each stage of the process (Applied, Reviewing, Interview, Accepted, Enrolled), providing a clear view of the pipeline's health.
    -   **Application Trends Chart**: A large `AreaChart` is a key feature, providing a clear visualization of application volume over time.
    -   **"Needing Review" List**: A clean, scannable list that provides the name and submission date of applications that require immediate attention.
    - **Demographics Chart**: A `PieChart` offers a quick visual breakdown of applicant demographics (e.g., Domestic vs. International).

## 6. Buttons

The Admissions interface would primarily use buttons for managing applicants:

-   **Primary & Secondary Actions**: Within an applicant's detailed view (future implementation), "Accept" would be a primary button (`bg-brand-primary`), while "Waitlist" or "Reject" would be secondary or destructive buttons to create a clear visual hierarchy for decisions.
-   **Table Actions**: Icon-only buttons (`Eye` icon) are used in the "Needing Review" list for a quick "View Application" action.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.