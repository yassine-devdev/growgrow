# Teacher: Design & Layout Guide

This document outlines the design system and layout principles for the **Teacher** user role. The Teacher interface is crafted to be an efficient and intuitive digital classroom assistant, focusing on schedule management, grading, and communication.

## 1. Design Philosophy

The Teacher UI is designed with three goals in mind:

-   **Focus**: Minimize distractions and surface the most relevant information for a teacher's daily tasks, such as today's schedule and assignments needing attention.
-   **Efficiency**: Streamline common workflows like grading and viewing course information to save teachers valuable time.
-   **Clarity**: Present student and assignment data in a clear, organized, and accessible manner.

## 2. Color Palette

The color palette is consistent with the global theme, but its application is tailored to the teacher's context.

-   **Primary (`#4f46e5`)**: Used for interactive elements, active navigation, and to highlight key stats on the dashboard.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Create a calm and focused environment, preventing visual fatigue during long grading sessions.
-   **Semantic Colors**:
    -   **Red/Yellow/Green**: Used extensively in the `Gradebook` to provide at-a-glance visual cues for student performance.
    -   **Green (`#22c55e`)**: Used in the dashboard's empty state icon to convey a positive "all caught up" message.

## 3. Typography

-   **Font**: `Inter` ensures that all text, from schedules to student names in the gradebook, is crisp and easy to read.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Card Titles (`h3`)**: lg (18px), font-bold.
    -   **Body Text**: sm (14px).
    -   **Gradebook/Table Text**: sm (14px) and xs (12px) for secondary info, ensuring data density without sacrificing clarity.

## 4. Core Layout Components

The layout for Teachers is structured to provide quick access to their most-used tools.

-   **Right Sidebar (L0 Navigation)**: Provides access to essential modules like `Dashboard`, `School Hub`, and `Comms`.
-   **Header (L1 Navigation)**: When in `School Hub`, the header provides direct links to "Academics" (for courses and grades) and "People."
-   **Left Sub-navigation (L2 Navigation)**: Allows easy switching between "Courses" and "Grades" within the "Academics" section.
-   **Content Area**: The Teacher's main workspace. The default `TeacherDashboard` is organized into two main columns: "Today's Schedule" and "Assignments to Grade." This immediately presents the teacher with their most urgent tasks.
-   **Footer**: Standard footer with access to overlay apps, which can be used for finding educational resources (Knowledge app) or creating teaching materials (Studio app).

## 5. Key Views & Component Styling

-   **Teacher Dashboard**: This is the command center. The "Assignments to Grade" card is interactive, with each item being a `Link` that navigates directly to the `TeacherGradebook` view. If there are no assignments to grade, a positive empty state is shown.
-   **Gradebook (`TeacherGradebook.tsx`)**: This is a highly specialized component.
    -   **Layout**: A "sticky" first column for student names and a horizontally scrolling table for assignments ensures context is never lost.
    -   **Cells**: Clicking a cell opens the `GradeEditModal`, which allows for entering a score and providing feedback. The modal includes an "AI Generate Feedback" feature.
    -   **Color Coding**: Cells are color-coded based on performance percentages to provide an instant visual summary of class performance.
    - **Feedback Indicator**: A small message icon appears in cells that contain written feedback, providing a subtle visual cue.

## 6. Buttons

The Teacher's interface relies on subtle and efficient button interactions:

-   **Link-based Actions**: The most common "button" is an entire list item that acts as a `Link`, such as clicking an assignment on the dashboard to navigate to the gradebook. This creates a large, easy-to-click target.
-   **Primary Buttons**: Reserved for modals, such as the "Save Grade" button in the `GradeEditModal`.
-   **AI Action Button**: The "Generate Feedback with AI" button is styled as a subtle but clear action within the modal, featuring a `Wand2` icon.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.