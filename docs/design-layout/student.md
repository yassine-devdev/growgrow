# Student: Design & Layout Guide

This document covers the design system and layout principles for the **Student** user role. The Student interface is designed to be an engaging, clear, and organized personal hub for managing academics and school life.

## 1. Design Philosophy

The Student UI is guided by the following principles:

-   **Action-Oriented**: The dashboard immediately surfaces the most important information: key stats and a clear list of upcoming tasks.
-   **Holistic Well-being**: The design goes beyond academics with the inclusion of the `WellnessCard`, encouraging students to be mindful of their emotional state.
-   **Clarity & Simplicity**: The interface avoids clutter, focusing the student on their immediate tasks and key academic metrics, making it easy to see what needs to be done next.

## 2. Color Palette

The global color palette is used to create a vibrant and encouraging environment.

-   **Primary (`#4f46e5`)**: Used for key stats, active navigation states, and as a highlight color for interactive elements.
-   **Neutrals (`#f7f8fa`, `#ffffff`, `#f0f2f5`)**: Provide a clean and modern backdrop that keeps the focus on the content.
-   **Semantic Colors**:
    -   **Red/Yellow/Blue**: Used in the "My Tasks" list to indicate assignment priority (High, Medium, Low), providing an instant visual cue for what needs attention first.
    -   **Green (`#22c55e`)**: Used to indicate completed tasks and for positive feedback, such as in the `WellnessCard` after a submission.
    -   **Mood Colors**: Green, yellow, and blue are used for the mood icons (`Happy`, `Neutral`, `Sad`) to create an intuitive visual language for the wellness check-in.

## 3. Typography

-   **Font**: `Inter` is used for its modern and clean aesthetic, which appeals to a younger demographic and ensures excellent readability.
-   **Hierarchy**:
    -   **Page Titles (`h1`)**: 2xl (24px), font-bold.
    -   **Card Titles (`h3`)**: lg (18px), font-bold.
    -   **Assignment Titles**: font-bold to stand out in the task list.
    -   **Secondary Info**: sm (14px) and xs (12px) for due dates and course names.

## 4. Core Layout Components

The Student layout is streamlined to focus on personal academic management.

-   **Right Sidebar (L0 Navigation)**: Simplified for students, offering access to core modules like `Dashboard`, `School Hub` (for courses/grades), `Comms`, and `Tools` (for the calendar).
-   **Header (L1 Navigation)**: Provides navigation within the chosen module, such as "Academics" or "Planner."
-   **Left Sub-navigation (L2 Navigation)**: Allows students to easily switch between their "Courses" list and their "Grades" overview.
-   **Content Area**: The `StudentDashboard` is the primary view. It is designed to give an immediate, visual summary of the student's academic standing and well-being, split between `StatCard`s, a `WellnessCard`, and an interactive `My Tasks` list.
-   **Footer**: Provides access to a range of overlay apps that support learning and hobbies, such as the `Knowledge` app for research, `Studio` for creative projects, and `Gamification` for achievements.

## 5. Key Views & Component Styling

-   **Student Dashboard**:
    -   **`StatCard`s**: Display key metrics like GPA and Attendance at the top for a quick status check.
    -   **`WellnessCard`**: A unique interactive component that prompts the user for a daily mood check-in. After submission, it displays a "Thank you" state and a simple bar chart of recent moods, promoting self-awareness.
    -   **"My Tasks" List**: A highly interactive list of upcoming assignments. Each item is a `Link` to the detailed `AssignmentView`. Priority is clearly marked with a colored dot, and completed items are visually distinct with a green checkmark icon. The list includes filters for status and priority.
-   **Assignment View (`AssignmentView.tsx`)**:
    -   **Layout**: A two-column layout separates the assignment `Instructions` and submission form from the key metadata (like the `Due Date`), preventing clutter.
    -   **Submission Form**: The form is clean and simple, with a large `textarea` and a clear file upload zone, guiding the user through the submission process. If an assignment has already been submitted, it shows a "Submitted" status card instead of the form.

## 6. Buttons

The Student UI features clear, action-oriented buttons:

-   **Primary Action**: The "Submit Assignment" button is the most critical call-to-action. It's a solid `brand-primary` button to make it highly visible and tappable. It provides clear feedback during submission with a loading spinner.
-   **Mood Buttons**: Large, icon-based buttons in the `WellnessCard` make the daily check-in quick and easy.
-   **Filter Dropdowns**: Small, unobtrusive `<select>` dropdowns are used for filtering the "My Tasks" list. This provides powerful functionality without cluttering the main view.

For a comprehensive guide to all button types, states, and their implementation, please see the **[Button Design Guide](./buttons.md)**.